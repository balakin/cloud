using System.Reflection;
using CloudApi.Validation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace CloudApi.Swagger;

public class EncodingContentTypeOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        var fromFormParameters = context.MethodInfo.GetParameters()
            .Where((parameterInfo) => parameterInfo.IsDefined(typeof(FromFormAttribute), true));

        if (!fromFormParameters.Any())
        {
            return;
        }

        foreach (var parameterInfo in fromFormParameters)
        {
            var contentTypeByPropertyName = parameterInfo.ParameterType.GetProperties()
                .Where((propertyInfo) =>
                    propertyInfo.IsDefined(typeof(FormFileValidatorAttribute), false)
                    && propertyInfo.GetCustomAttribute<FormFileValidatorAttribute>()!.ContentType != null)
                .ToDictionary(
                    (propertyInfo) => propertyInfo.Name.ToLower(),
                    (propertyInfo) =>
                        new ContentType(propertyInfo.GetCustomAttribute<FormFileValidatorAttribute>()!.ContentType!));

            if (!contentTypeByPropertyName.Any())
            {
                return;
            }

            foreach (var requestContent in operation.RequestBody.Content)
            {
                var properties = requestContent.Value.Schema.Properties;
                foreach (var property in properties)
                {
                    if (contentTypeByPropertyName.ContainsKey(property.Key.ToLower()))
                    {
                        string description = $"Content type: {contentTypeByPropertyName[property.Key].ToFormattedString()}";
                        if (string.IsNullOrWhiteSpace(property.Value.Description))
                        {
                            property.Value.Description = description;
                        }
                        else
                        {
                            property.Value.Description += $" | {description}";
                        }

                    }
                }

                var encodings = requestContent.Value.Encoding;
                foreach (var encoding in encodings)
                {
                    if (contentTypeByPropertyName.ContainsKey(encoding.Key.ToLower()))
                    {
                        encoding.Value.ContentType = contentTypeByPropertyName[encoding.Key].ToString();
                    }
                }
            }
        }
    }
}

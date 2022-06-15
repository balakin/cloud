using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using CloudApi.Options;
using System.Reflection;

namespace CloudApi.Swagger;

public class ConfigureSwaggerGenerationOptions : IConfigureOptions<SwaggerGenOptions>
{
    private readonly IApiVersionDescriptionProvider _provider;

    private readonly ApplicationOptions _applicationOptions;

    public ConfigureSwaggerGenerationOptions(
        IApiVersionDescriptionProvider provider,
        IOptions<ApplicationOptions> applicationOptionsAccessor)
    {
        _provider = provider;
        _applicationOptions = applicationOptionsAccessor.Value;
    }

    public void Configure(SwaggerGenOptions options)
    {
        options.DescribeAllParametersInCamelCase();

        options.CustomSchemaIds(TransformSchemaId);

        foreach (var description in _provider.ApiVersionDescriptions)
        {
            options.SwaggerDoc(description.GroupName, CreateInfoForApiVersion(description));
        }

        var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
        options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));

        options.OperationFilter<EncodingContentTypeOperationFilter>();
    }

    private OpenApiInfo CreateInfoForApiVersion(ApiVersionDescription description)
    {
        var info = new OpenApiInfo()
        {
            Title = _applicationOptions.Name,
            Version = description.ApiVersion.ToString(),
            Description = _applicationOptions.Description,
        };

        if (description.IsDeprecated)
        {
            info.Description += " This API version has been deprecated.";
        }

        return info;
    }

    private static string TransformSchemaId(Type type)
    {
        string name = type.Name;
        name = Regex.Replace(name, "Dto$|Dto`.?$", string.Empty);
        if (Regex.IsMatch(name, "Pagination`.+$|Pagination$") && type.GenericTypeArguments.Length > 0)
        {
            Type contentType = type.GenericTypeArguments[0];
            name = Regex.Replace(name, "Pagination`.+$|Pagination$", $"Pagination{TransformSchemaId(contentType)}");
        }

        return name;
    }
}

using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.Extensions.Options;
using Swashbuckle.AspNetCore.SwaggerUI;
using CloudApi.Options;

namespace CloudApi.Swagger;

public class ConfigureSwaggerUIOptions : IConfigureOptions<SwaggerUIOptions>
{
    private readonly IApiVersionDescriptionProvider _provider;

    private readonly ApplicationOptions _applicationOptions;

    public ConfigureSwaggerUIOptions(IApiVersionDescriptionProvider provider, IOptions<ApplicationOptions> applicationOptionsAccessor)
    {
        _provider = provider;
        _applicationOptions = applicationOptionsAccessor.Value;
    }

    public void Configure(SwaggerUIOptions options)
    {
        foreach (var description in _provider.ApiVersionDescriptions)
        {
            options.SwaggerEndpoint(CreateEndpointUrl(description), CreateEndpointName(description));
        }
    }

    private string CreateEndpointUrl(ApiVersionDescription description)
    {
        return $"{description.GroupName}/swagger.json";
    }

    private string CreateEndpointName(ApiVersionDescription description)
    {
        return $"{_applicationOptions.Name} {description.GroupName}";
    }
}

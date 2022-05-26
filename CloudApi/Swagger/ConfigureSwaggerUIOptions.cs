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

        options.InjectJavascript("/swagger-ui/custom.js");
        options.InjectStylesheet("/swagger-ui/material.css");

        options.Interceptors.RequestInterceptorFunction = "function (request) { return applicationRequestInterceptor(request); }";
        options.Interceptors.ResponseInterceptorFunction = "function (response) { return applicationResponseInterceptor(response); }";
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

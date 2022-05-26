using CloudApi.Transformers;
using Microsoft.AspNetCore.Mvc.ApplicationModels;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers((options) =>
    {
        var slugify = new SlugifyParameterTransformer();
        var transformer = new RouteTokenTransformerConvention(slugify);
        options.Conventions.Add(transformer);
    });

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

app.Run();

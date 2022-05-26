var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCloudOptions(builder.Configuration);

builder.Services.AddCloudDevelopmentDatabase();

builder.Services.AddCloudControllers();

builder.Services.AddCloudVersioning();

builder.Services.AddCloudSwagger();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

app.Run();

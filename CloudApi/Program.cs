var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCloudOptions(builder.Configuration);

builder.Services.AddCloudAntiforgery();

builder.Services.AddCloudDevelopmentDatabase();

builder.Services.AddCloudAuth();

builder.Services.AddCloudControllers();

builder.Services.AddCloudVersioning();

builder.Services.AddCloudSwagger();

var app = builder.Build();

app.UseCloudAntiforgery();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();

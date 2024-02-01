using THREAOcrBE.Services;
using THREAOcrBE.Services.Data;
using THREAOcrBE.Hubs;

using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using THREAOcrBE.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();

// work object, where the computations are done.
builder.Services.AddTransient<IComputationWorkService, ComputationWorkService>();

// QueuedBackgroundService is a dual-purpose service
builder.Services.AddHostedService<QueuedBackgroundService>();
builder.Services.AddTransient<IQueuedBackgroundService, QueuedBackgroundService>();

// Manages jobs
builder.Services.AddTransient<IComputationJobStatusService, ComputationJobStatusService>();

// var useRedisCache = Configuration.GetValue<bool>(
//     "UnsecureApplicationSettings:UseRedisCache");

// var redisCacheConnectionString = Configuration.GetValue<string>(
//     "UnsecureApplicationSettings:RedisCacheConnectionString");

// if (useRedisCache && !string.IsNullOrWhiteSpace(redisCacheConnectionString))
// {
//     // setup redis cache for horizontally scaled services
//     builder.Services.AddSingleton<IConnectionMultiplexer>(
//         ConnectionMultiplexer.Connect(redisCacheConnectionString));
//     // job status service, CRUD operations on jobs stored in redis cache.
//     builder.Services.AddTransient<IJobStorageService, RedisCacheJobStorageService>();
// }
// else
// {
//     // strictly for testing purposes
    builder.Services.AddTransient<IJobStorageService, MemoryCacheJobStorageService>();
// }

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpClient();

// allowing all origins CORS Policy
builder.Services.AddCors(options => 
    options.AddPolicy(name: "ThreaCORS", policy => {
        policy.AllowAnyHeader()
            .AllowAnyMethod()
            .SetIsOriginAllowed(origin => true)
            .AllowCredentials();
    })
);

// builder.Services.AddCors(options => 
//     options.AddPolicy(name: "SocketCORS", policy => {
//         policy.WithOrigins("http://localhost:3000")
//             .AllowAnyHeader()
//             .AllowAnyMethod()
//             .AllowCredentials();
//     })
// );
builder.Services.AddSingleton<SharedDb>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection(); // rerouting
app.UseRouting();

app.UseCors("ThreaCORS"); // need before auth and after rerouting
// app.UseCors("SocketCORS"); // need before auth and after rerouting

app.UseAuthorization(); // auth

app.MapControllers();
app.MapHub<JobHub>("/monitor");

app.Run();

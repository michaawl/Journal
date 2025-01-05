using JournalGrpcService.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddGrpc();

// CORS konfigurieren
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors();
app.UseGrpcWeb();

app.MapGrpcService<JournalService>().EnableGrpcWeb();
app.MapGet("/", () => "This server is running. Use a gRPC client to communicate with gRPC endpoints.");

app.Run();

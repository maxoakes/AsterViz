var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var root = Directory.GetCurrentDirectory();
var dotenv = Path.Combine(root, ".env");
MyRoute.DotEnv.Load(dotenv);

var  MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        name: MyAllowSpecificOrigins, policy  =>
        {
            policy.WithOrigins(
                "http://" + Environment.GetEnvironmentVariable("SERVER_IP") + ":" + Environment.GetEnvironmentVariable("SERVER_PORT"),
                Environment.GetEnvironmentVariable("SERVER_IP") + ":" + Environment.GetEnvironmentVariable("SERVER_PORT")
                );
        });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(MyAllowSpecificOrigins);
app.UseAuthorization();
app.MapControllers();
app.Run();
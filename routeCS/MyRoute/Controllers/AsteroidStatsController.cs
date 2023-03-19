using Microsoft.AspNetCore.Mvc;
using System;
using Microsoft.Data.SqlClient;
using Npgsql;
using Microsoft.AspNetCore.Cors;

namespace MyRoute.Controllers;

[ApiController]
[Route("[controller]")]
public class AsteroidStatsController : ControllerBase
{
    private readonly ILogger<AsteroidStatsController> _logger;

    public AsteroidStatsController(ILogger<AsteroidStatsController> logger)
    {
        _logger = logger;
    }

    // [EnableCors()]
    [HttpGet(Name = "AsteroidStats")]
    public AsteroidStats Get()
    {
        string connectionString = String.Format(
            @"Host={0},{1};Database={2};Username={3};Password={4};",
            Environment.GetEnvironmentVariable("DB_HOST"),
            Environment.GetEnvironmentVariable("DB_PORT"),
            Environment.GetEnvironmentVariable("DB_NAME"),
            Environment.GetEnvironmentVariable("DB_USER"),
            Environment.GetEnvironmentVariable("DB_PASS")
        );
        System.Console.WriteLine("Connecting with " + connectionString);
        var conn = new NpgsqlConnection(connectionString);
        conn.Open();
        NpgsqlCommand command = new NpgsqlCommand("SELECT COUNT(*) FROM ASTEROIDS", conn);
        var reader = command.ExecuteReader();
        int count = -1;
        while (reader.Read())
        {
            count = reader.GetInt32(0);
            System.Console.WriteLine("Read " + count);
        }
        conn.Close();

        var stats = new AsteroidStats
        {
            AsteroidCount = count,
            ClassificationCount = -1, //not implemented
            UserCount = -1 //not implemented
        };
        return stats;
    }
}

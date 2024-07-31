using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using ReactHomepage.DAL;
using ReactHomepage.Filters;
using ReactHomepage.Interfaces;
using ReactHomepage.Models;
using System;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// Configure logging
builder.Logging.ClearProviders(); // Optionally clear default providers
builder.Logging.AddConsole(); // Add console logging
builder.Logging.AddDebug();   // Optionally add debug logging

// Add services to the container.
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(10);
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.Strict;
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

builder.Services.AddControllersWithViews();

var path = Path.Combine(Environment.CurrentDirectory, "App_Data");
var dbPath = Path.Combine(path, "Personal.db");

builder.Services.AddDbContext<PersonalContext>(options =>
    options.UseSqlite($"Data Source={dbPath}"));

builder.Services.AddScoped<IPhotoManager, PhotoManager>();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "SireusCore", Version = "v1" });
    c.DocumentFilter<CustomDocumentFilter>();  // Register the custom document filter
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseSession();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapControllerRoute(
    name: "handler",
    pattern: "Handler/{action}/{arg1}/{arg2}",
    defaults: new { controller = "Handler" });

app.MapControllerRoute(
    name: "api",
    pattern: "api/{controller}/{action}/{id?}");

// Fallback route
app.MapFallbackToController("Index", "Home");

app.UseSwagger();

app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "SireusCore V1");
    c.RoutePrefix = "swagger";
});

app.Run();

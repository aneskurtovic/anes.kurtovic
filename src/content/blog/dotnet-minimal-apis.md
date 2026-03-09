---
title: "Minimal APIs in .NET — When Less Is More"
date: 2026-03-07
description: "A look at .NET minimal APIs, when they make sense over controllers, and patterns for keeping them clean at scale."
tags: [".net", "api-design", "csharp"]
draft: false
---

When .NET 6 introduced minimal APIs, the reception was mixed. Some loved the simplicity. Others worried about losing structure. After using them in production for over a year, here's where I've landed.

## The appeal

Compare a traditional controller endpoint to its minimal API equivalent:

```csharp
// Controller approach
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _service;

    public ProductsController(IProductService service) => _service = service;

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var product = await _service.GetByIdAsync(id);
        return product is null ? NotFound() : Ok(product);
    }
}
```

```csharp
// Minimal API approach
app.MapGet("/api/products/{id}", async (int id, IProductService service) =>
    await service.GetByIdAsync(id) is { } product
        ? Results.Ok(product)
        : Results.NotFound());
```

Less ceremony, same result. For straightforward CRUD endpoints, minimal APIs remove a lot of boilerplate.

## When controllers still win

Minimal APIs aren't always the right call. I still reach for controllers when:

- **Complex model binding** is needed — controllers handle `[FromBody]`, `[FromQuery]`, and custom binders more naturally
- **Filters and middleware** are heavily used — action filters don't exist in minimal APIs (though endpoint filters fill some of that gap)
- **Large API surfaces** — 50+ endpoints in a single file gets unwieldy fast

## Keeping minimal APIs organized

The biggest criticism of minimal APIs is that everything ends up in `Program.cs`. That's only true if you let it. I use extension methods to group related endpoints:

```csharp
public static class ProductEndpoints
{
    public static void MapProductEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/products")
            .WithTags("Products");

        group.MapGet("/", GetAll);
        group.MapGet("/{id}", GetById);
        group.MapPost("/", Create);
    }

    private static async Task<IResult> GetAll(IProductService service)
        => Results.Ok(await service.GetAllAsync());

    private static async Task<IResult> GetById(int id, IProductService service)
        => await service.GetByIdAsync(id) is { } product
            ? Results.Ok(product)
            : Results.NotFound();

    private static async Task<IResult> Create(CreateProductRequest req, IProductService service)
        => Results.Created($"/api/products/{await service.CreateAsync(req)}", null);
}
```

Then `Program.cs` stays clean:

```csharp
var app = builder.Build();
app.MapProductEndpoints();
app.MapOrderEndpoints();
app.Run();
```

## The verdict

Use minimal APIs for small-to-medium services where simplicity is a feature. Use controllers when you need the full MVC pipeline. There's no rule that says you can't mix both in the same project — and sometimes that's exactly the right move.

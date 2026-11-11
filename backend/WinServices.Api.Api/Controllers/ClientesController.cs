using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using WinServices.Api.Application.Interfaces;

namespace WinServices.Api.Api.Controllers;

/// <summary>
/// Buscador asíncrono de clientes activos por número de documento o razón social.
/// </summary>
[ApiController]
[Route("api/v{version:apiVersion}/clientes")]
[ApiVersion(1.0)]
public sealed class ClientesController : ControllerBase
{
    private readonly IClienteService _service;

    public ClientesController(IClienteService service)
    {
        _service = service;
    }

    /// <summary>
    /// Busca clientes activos por DNI/RUC (prefijo) o razón social/nombre (contiene).
    /// </summary>
    /// <param name="q">Término de búsqueda (mínimo 3 caracteres).</param>
    /// <param name="limit">Cantidad máxima de resultados (1 a 50, por defecto 10).</param>
    [HttpGet("buscar")]
    public async Task<IActionResult> Buscar(
        [FromQuery] string? q,
        [FromQuery] int limit = 10,
        CancellationToken cancellationToken = default)
    {
        var result = await _service.BuscarAsync(q ?? string.Empty, limit, cancellationToken);

        if (!result.IsSuccess)
            return BadRequest(new { error = result.Error });

        return Ok(result.Value);
    }
}

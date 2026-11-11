using WinServices.Api.Application.Common;
using WinServices.Api.Application.DTOs;

namespace WinServices.Api.Application.Interfaces;

/// <summary>Contrato del servicio de clientes.</summary>
public interface IClienteService
{
    /// <summary>
    /// Busca clientes activos validando que el término tenga al menos 3 caracteres.
    /// </summary>
    Task<Result<IEnumerable<ClienteDto>>> BuscarAsync(
        string termino,
        int limite,
        CancellationToken cancellationToken = default);
}

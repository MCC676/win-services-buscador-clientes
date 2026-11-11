using WinServices.Api.Domain.Entities;

namespace WinServices.Api.Application.Interfaces;

/// <summary>Contrato del repositorio de clientes.</summary>
public interface IClienteRepository
{
    /// <summary>
    /// Busca clientes activos por número de documento (prefijo) o razón social (contiene).
    /// </summary>
    Task<IEnumerable<Cliente>> BuscarAsync(
        string termino,
        int limite,
        CancellationToken cancellationToken = default);
}

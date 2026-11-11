using WinServices.Api.Application.DTOs;
using WinServices.Api.Domain.Entities;

namespace WinServices.Api.Application.Mapping;

/// <summary>Mapeo entre la entidad Cliente y su DTO de salida.</summary>
public static class ClienteMapper
{
    public static ClienteDto ToDto(this Cliente cliente) => new(
        cliente.Id,
        cliente.TipoDocumento,
        cliente.NumeroDocumento,
        cliente.RazonSocial,
        cliente.Segmento,
        cliente.Correo
    );

    public static IEnumerable<ClienteDto> ToDtoList(this IEnumerable<Cliente> clientes) =>
        clientes.Select(c => c.ToDto());
}

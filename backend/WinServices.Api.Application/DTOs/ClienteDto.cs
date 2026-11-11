namespace WinServices.Api.Application.DTOs;

/// <summary>Datos de un cliente devueltos por el buscador.</summary>
public sealed record ClienteDto(
    int Id,
    string TipoDocumento,
    string NumeroDocumento,
    string RazonSocial,
    string Segmento,
    string Correo
);

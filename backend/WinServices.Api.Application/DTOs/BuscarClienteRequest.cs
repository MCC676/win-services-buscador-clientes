namespace WinServices.Api.Application.DTOs;

/// <summary>Criterios de búsqueda de clientes (término y límite de resultados).</summary>
public sealed record BuscarClienteRequest(
    string Termino,
    int Limite
);

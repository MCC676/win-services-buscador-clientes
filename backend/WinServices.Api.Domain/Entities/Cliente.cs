namespace WinServices.Api.Domain.Entities;

/// <summary>
/// Cliente del CRM. Es una proyección de solo lectura usada por el buscador;
/// Dapper la materializa directamente desde el stored procedure dbo.usp_Cliente_Buscar.
/// </summary>
public sealed class Cliente
{
    public int Id { get; private set; }
    public string TipoDocumento { get; private set; } = string.Empty;
    public string NumeroDocumento { get; private set; } = string.Empty;
    public string RazonSocial { get; private set; } = string.Empty;
    public string Segmento { get; private set; } = string.Empty;
    public string Correo { get; private set; } = string.Empty;

    // Requerido por Dapper para materializar los resultados (reflection).
    private Cliente() { }
}

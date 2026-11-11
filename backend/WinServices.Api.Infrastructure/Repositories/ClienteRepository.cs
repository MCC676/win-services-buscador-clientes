using System.Data;
using Dapper;
using WinServices.Api.Application.Interfaces;
using WinServices.Api.Domain.Entities;
using WinServices.Api.Infrastructure.Data;

namespace WinServices.Api.Infrastructure.Repositories;

/// <summary>
/// Repositorio de clientes con Dapper. Invoca el stored procedure
/// dbo.usp_Cliente_Buscar (CommandType.StoredProcedure).
/// </summary>
public sealed class ClienteRepository : BaseRepository, IClienteRepository
{
    public ClienteRepository(IDbConnectionFactory connectionFactory) : base(connectionFactory)
    {
    }

    public async Task<IEnumerable<Cliente>> BuscarAsync(
        string termino,
        int limite,
        CancellationToken cancellationToken = default)
    {
        using var connection = ConnectionFactory.CreateConnection();

        return await connection.QueryAsync<Cliente>(
            "dbo.usp_Cliente_Buscar",
            new { Termino = termino, Limite = limite },
            commandType: CommandType.StoredProcedure
        );
    }
}

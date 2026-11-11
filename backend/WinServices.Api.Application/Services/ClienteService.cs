using FluentValidation;
using Microsoft.Extensions.Logging;
using WinServices.Api.Application.Common;
using WinServices.Api.Application.DTOs;
using WinServices.Api.Application.Interfaces;
using WinServices.Api.Application.Mapping;

namespace WinServices.Api.Application.Services;

/// <summary>
/// Servicio del buscador de clientes: valida el término (mínimo 3 caracteres),
/// delega la consulta al repositorio y devuelve Result&lt;T&gt; sin lanzar excepciones
/// para errores de negocio.
/// </summary>
public sealed class ClienteService : IClienteService
{
    private const int LIMITE_POR_DEFECTO = 10;
    private const int LIMITE_MAXIMO = 50;

    private readonly IClienteRepository _repository;
    private readonly IValidator<BuscarClienteRequest> _validator;
    private readonly ILogger<ClienteService> _logger;

    public ClienteService(
        IClienteRepository repository,
        IValidator<BuscarClienteRequest> validator,
        ILogger<ClienteService> logger)
    {
        _repository = repository;
        _validator  = validator;
        _logger     = logger;
    }

    public async Task<Result<IEnumerable<ClienteDto>>> BuscarAsync(
        string termino,
        int limite,
        CancellationToken cancellationToken = default)
    {
        var terminoNormalizado = termino.Trim();
        var limiteNormalizado  = limite <= 0
            ? LIMITE_POR_DEFECTO
            : Math.Min(limite, LIMITE_MAXIMO);

        var validation = await _validator.ValidateAsync(
            new BuscarClienteRequest(terminoNormalizado, limiteNormalizado),
            cancellationToken);

        if (!validation.IsValid)
        {
            var errors = string.Join("; ", validation.Errors.Select(e => e.ErrorMessage));
            _logger.LogWarning("Búsqueda de clientes rechazada: {Errors}", errors);
            return Result<IEnumerable<ClienteDto>>.Failure(errors);
        }

        var clientes = (await _repository.BuscarAsync(
            terminoNormalizado,
            limiteNormalizado,
            cancellationToken)).ToList();

        _logger.LogInformation(
            "Búsqueda de clientes con término {Termino} devolvió {Cantidad} resultados",
            terminoNormalizado,
            clientes.Count);

        return Result<IEnumerable<ClienteDto>>.Success(clientes.ToDtoList());
    }
}

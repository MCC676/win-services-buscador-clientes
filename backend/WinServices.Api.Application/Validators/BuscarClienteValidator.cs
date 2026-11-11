using FluentValidation;
using WinServices.Api.Application.DTOs;

namespace WinServices.Api.Application.Validators;

/// <summary>
/// Reglas de validación del buscador de clientes. Se registra automáticamente
/// mediante AddValidatorsFromAssembly.
/// </summary>
public sealed class BuscarClienteValidator : AbstractValidator<BuscarClienteRequest>
{
    public BuscarClienteValidator()
    {
        RuleFor(x => x.Termino)
            .NotEmpty().WithMessage("El término de búsqueda es obligatorio.")
            .MinimumLength(3).WithMessage("El término de búsqueda debe tener al menos 3 caracteres.")
            .MaximumLength(100).WithMessage("El término de búsqueda no puede superar los 100 caracteres.");

        RuleFor(x => x.Limite)
            .InclusiveBetween(1, 50).WithMessage("El límite debe estar entre 1 y 50.");
    }
}

/* ==============================================================================
   EVALUACIÓN TÉCNICA PRÁCTICA — EJERCICIO 3: BUSCADOR ASÍNCRONO DE CLIENTES
   Stored Procedure: dbo.usp_Cliente_Buscar
   Base de datos:    PE_WINET_CRM (SQL Server)
   ============================================================================== */

USE PE_WINET_CRM;
GO

CREATE OR ALTER PROCEDURE dbo.usp_Cliente_Buscar
    @Termino VARCHAR(100),
    @Limite  INT = 10
AS
BEGIN
    SET NOCOUNT ON;

    -- Normaliza el término y protege el límite contra valores inválidos.
    SET @Termino = LTRIM(RTRIM(ISNULL(@Termino, '')));

    IF @Limite IS NULL OR @Limite < 1
        SET @Limite = 10;

    IF @Limite > 100
        SET @Limite = 100;

    SELECT TOP (@Limite)
        Id,
        TipoDocumento,
        NumeroDocumento,
        RazonSocial,
        Segmento,
        Correo
    FROM dbo.Cliente
    WHERE Activo = 1
      AND (
            NumeroDocumento LIKE @Termino + '%'
            OR RazonSocial LIKE '%' + @Termino + '%'
          )
    ORDER BY RazonSocial ASC;
END;
GO

/* ==============================================================================
   Ejemplos de uso
   ==============================================================================
   EXEC dbo.usp_Cliente_Buscar @Termino = '205', @Limite = 10;   -- por documento
   EXEC dbo.usp_Cliente_Buscar @Termino = 'BANCO', @Limite = 10; -- por razón social
   ============================================================================== */

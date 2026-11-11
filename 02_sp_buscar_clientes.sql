
CREATE OR ALTER PROCEDURE dbo.usp_Cliente_Buscar
    @Termino VARCHAR(100),
    @Limite  INT = 10
AS
BEGIN
    SET NOCOUNT ON;

    SET @Termino = LTRIM(RTRIM(ISNULL(@Termino, '')));

    IF @Limite IS NULL OR @Limite < 1 SET @Limite = 10;
    IF @Limite > 100  SET @Limite = 100;

    SELECT TOP (@Limite) Id,TipoDocumento, NumeroDocumento, RazonSocial,Segmento, Correo
    FROM dbo.Cliente
    WHERE Activo = 1
      AND (NumeroDocumento LIKE @Termino + '%' OR RazonSocial LIKE '%' + @Termino + '%')
    ORDER BY RazonSocial ASC;
END;


 --  EXEC dbo.usp_Cliente_Buscar @Termino = '205', @Limite = 10;   -- por documento
  -- EXEC dbo.usp_Cliente_Buscar @Termino = 'BANCO', @Limite = 10; -- por razón social

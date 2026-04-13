CREATE TABLE Jugadores (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(120) NOT NULL,
    NombreNormalizado NVARCHAR(120) NOT NULL UNIQUE,
    CategoriaBase INT NOT NULL,
    PosicionPreferida NVARCHAR(50) NULL,
    Activo BIT NOT NULL DEFAULT 1,
    FechaAlta DATETIME2 NOT NULL
);

CREATE TABLE Partidos (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    FechaPartido DATE NOT NULL,
    CategoriaPlantel INT NOT NULL,
    Rival NVARCHAR(120) NOT NULL,
    ArchivoOriginal NVARCHAR(255) NOT NULL,
    FechaImportacion DATETIME2 NOT NULL,
    CONSTRAINT UQ_Partido UNIQUE (FechaPartido, Rival, CategoriaPlantel)
);

CREATE TABLE JugadorAliases (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    JugadorId INT NOT NULL,
    Alias NVARCHAR(120) NOT NULL,
    AliasNormalizado NVARCHAR(120) NOT NULL UNIQUE,
    CONSTRAINT FK_JugadorAliases_Jugador FOREIGN KEY (JugadorId) REFERENCES Jugadores(Id) ON DELETE CASCADE
);

CREATE TABLE RendimientosJugador (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    PartidoId INT NOT NULL,
    JugadorId INT NOT NULL,
    Posicion NVARCHAR(50) NULL,
    Valoracion DECIMAL(5,2) NULL,
    Goles INT NOT NULL DEFAULT 0,
    Asistencias INT NOT NULL DEFAULT 0,
    EsSuplente BIT NOT NULL DEFAULT 0,
    Jugo BIT NOT NULL DEFAULT 0,
    OrdenRendimiento INT NULL,
    PuestoJugados INT NULL,
    PuntosRanking DECIMAL(8,2) NOT NULL DEFAULT 0,
    BonusGA DECIMAL(8,2) NOT NULL DEFAULT 0,
    PuestoTitulares INT NULL,
    PenalizacionPeores5 DECIMAL(8,2) NOT NULL DEFAULT 0,
    MultiplicadorSuplente DECIMAL(6,2) NOT NULL DEFAULT 1,
    PuntosFinales DECIMAL(8,2) NOT NULL DEFAULT 0,
    CONSTRAINT FK_Rendimientos_Partido FOREIGN KEY (PartidoId) REFERENCES Partidos(Id) ON DELETE CASCADE,
    CONSTRAINT FK_Rendimientos_Jugador FOREIGN KEY (JugadorId) REFERENCES Jugadores(Id),
    CONSTRAINT UQ_RendimientoPartidoJugador UNIQUE (PartidoId, JugadorId)
);

CREATE TABLE ImportacionesArchivo (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    NombreArchivo NVARCHAR(255) NOT NULL,
    Fecha DATETIME2 NOT NULL,
    Estado INT NOT NULL,
    Observaciones NVARCHAR(1500) NULL,
    FilasProcesadas INT NOT NULL DEFAULT 0,
    JugadoresNuevos INT NOT NULL DEFAULT 0,
    PartidoId INT NULL,
    CONSTRAINT FK_Importaciones_Partido FOREIGN KEY (PartidoId) REFERENCES Partidos(Id) ON DELETE SET NULL
);

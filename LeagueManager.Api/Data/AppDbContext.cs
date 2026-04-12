using LeagueManager.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LeagueManager.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Jugador> Jugadores => Set<Jugador>();
    public DbSet<JugadorAlias> JugadorAliases => Set<JugadorAlias>();
    public DbSet<Partido> Partidos => Set<Partido>();
    public DbSet<RendimientoJugador> RendimientosJugador => Set<RendimientoJugador>();
    public DbSet<ImportacionArchivo> ImportacionesArchivo => Set<ImportacionArchivo>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Jugador>(entity =>
        {
            entity.Property(x => x.Nombre).HasMaxLength(120).IsRequired();
            entity.Property(x => x.NombreNormalizado).HasMaxLength(120).IsRequired();
            entity.Property(x => x.PosicionPreferida).HasMaxLength(50);
            entity.HasIndex(x => x.NombreNormalizado).IsUnique();
        });

        modelBuilder.Entity<JugadorAlias>(entity =>
        {
            entity.Property(x => x.Alias).HasMaxLength(120).IsRequired();
            entity.Property(x => x.AliasNormalizado).HasMaxLength(120).IsRequired();
            entity.HasIndex(x => x.AliasNormalizado).IsUnique();
            entity.HasOne(x => x.Jugador)
                .WithMany(x => x.Aliases)
                .HasForeignKey(x => x.JugadorId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Partido>(entity =>
        {
            entity.Property(x => x.Rival).HasMaxLength(120).IsRequired();
            entity.Property(x => x.ArchivoOriginal).HasMaxLength(255).IsRequired();
            entity.HasIndex(x => new { x.FechaPartido, x.Rival, x.CategoriaPlantel }).IsUnique();
        });

        modelBuilder.Entity<RendimientoJugador>(entity =>
        {
            entity.Property(x => x.Posicion).HasMaxLength(50);
            entity.Property(x => x.Valoracion).HasColumnType("decimal(5,2)");
            entity.Property(x => x.PuntosRanking).HasColumnType("decimal(8,2)");
            entity.Property(x => x.BonusGA).HasColumnType("decimal(8,2)");
            entity.Property(x => x.PenalizacionPeores5).HasColumnType("decimal(8,2)");
            entity.Property(x => x.MultiplicadorSuplente).HasColumnType("decimal(6,2)");
            entity.Property(x => x.PuntosFinales).HasColumnType("decimal(8,2)");

            entity.HasOne(x => x.Partido)
                .WithMany(x => x.Rendimientos)
                .HasForeignKey(x => x.PartidoId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(x => x.Jugador)
                .WithMany(x => x.Rendimientos)
                .HasForeignKey(x => x.JugadorId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(x => new { x.PartidoId, x.JugadorId }).IsUnique();
        });

        modelBuilder.Entity<ImportacionArchivo>(entity =>
        {
            entity.Property(x => x.NombreArchivo).HasMaxLength(255).IsRequired();
            entity.Property(x => x.Observaciones).HasMaxLength(1500);
            entity.HasOne(x => x.Partido)
                .WithMany()
                .HasForeignKey(x => x.PartidoId)
                .OnDelete(DeleteBehavior.SetNull);
        });
    }
}

# Primera migración sugerida (MVP)

Cuando tengas `dotnet-ef` disponible, ejecutá:

```bash
dotnet tool install --global dotnet-ef
dotnet ef migrations add InitialCreate --project LeagueManager.Api --startup-project LeagueManager.Api
dotnet ef database update --project LeagueManager.Api --startup-project LeagueManager.Api
```

Este proyecto ya incluye una propuesta de SQL inicial en `0001_InitialCreate.sql` para revisión funcional.

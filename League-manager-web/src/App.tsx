import { useMemo, useState } from 'react';
import { AppBar, Box, Container, Tab, Tabs, Toolbar, Typography } from '@mui/material';
import DashboardPage from './pages/DashboardPage';
import ImportarPartidoPage from './pages/ImportarPartidoPage';
import JugadoresPage from './pages/JugadoresPage';
import PartidosPage from './pages/PartidosPage';
import Mejor11Page from './pages/Mejor11Page';

type Section = 'dashboard' | 'importar' | 'jugadores' | 'partidos' | 'mejor11';

function App() {
  const [section, setSection] = useState<Section>('dashboard');

  const content = useMemo(() => {
    switch (section) {
      case 'importar':
        return <ImportarPartidoPage />;
      case 'jugadores':
        return <JugadoresPage />;
      case 'partidos':
        return <PartidosPage />;
      case 'mejor11':
        return <Mejor11Page />;
      default:
        return <DashboardPage />;
    }
  }, [section]);

  return (
    <Box>
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 700, mr: 3 }}>
            League Manager
          </Typography>
          <Tabs
            textColor="inherit"
            indicatorColor="secondary"
            value={section}
            onChange={(_, value: Section) => setSection(value)}
          >
            <Tab value="dashboard" label="Dashboard" />
            <Tab value="importar" label="Importar Partido" />
            <Tab value="jugadores" label="Jugadores" />
            <Tab value="partidos" label="Partidos" />
            <Tab value="mejor11" label="Mejor 11" />
          </Tabs>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 3 }}>{content}</Container>
    </Box>
  );
}

export default App;

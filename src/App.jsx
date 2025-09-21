import React, { createContext, useContext, useReducer, useMemo, useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Card, CardContent, CardHeader, IconButton, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, FormGroup, FormControlLabel,
  Checkbox, TextField, InputAdornment, Box, CssBaseline, ThemeProvider, createTheme, Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

// --- 1. THEME & STYLES ---

const theme = createTheme({
  palette: {
    background: { default: '#f4f6f8', paper: '#ffffff' },
    primary: { main: '#3f51b5' },
    text: { primary: '#172b4d', secondary: '#6b778c' }
  },
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h4: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: 'rgba(149, 157, 165, 0.1) 0px 8px 24px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }
      }
    },
    MuiCardHeader: { styleOverrides: { title: { fontSize: '1rem', fontWeight: 600 } } }
  }
});

// --- 2. DATA SOURCE ---

const dashboardData = {
  layout: [
    { id: "cat_cspm", title: "CSPM Executive Dashboard", widgets: ["widget_cloud_accounts", "widget_cloud_risk"] },
    { id: "cat_cwpp", title: "CWPP Dashboard", widgets: ["widget_namespace_alerts", "widget_workload_alerts"] },
    { id: "cat_registry", title: "Registry Scan", widgets: ["widget_image_risk", "widget_image_security"] },
  ],
  availableWidgets: {
    widget_cloud_accounts: { id: "widget_cloud_accounts", title: "Cloud Accounts", component: "CloudAccountsWidget" },
    widget_cloud_risk: { id: "widget_cloud_risk", title: "Cloud Account Risk Assessment", component: "RiskAssessmentWidget" },
    widget_namespace_alerts: { id: "widget_namespace_alerts", title: "Top 5 Namespace Specific Alerts", component: "PlaceholderWidget" },
    widget_workload_alerts: { id: "widget_workload_alerts", title: "Workload Alerts", component: "PlaceholderWidget" },
    widget_image_risk: { id: "widget_image_risk", title: "Image Risk Assessment", component: "ImageRiskWidget" },
    widget_image_security: { id: "widget_image_security", title: "Image Security Issues", component: "ImageSecurityWidget" },
    widget_compliance_status: { id: "widget_compliance_status", title: "Compliance Status", component: "PlaceholderWidget" },
    widget_top_vulnerabilities: { id: "widget_top_vulnerabilities", title: "Top Vulnerabilities", component: "PlaceholderWidget" },
  },
};

// --- 3. STATE MANAGEMENT (React Context & Reducer) ---

const DashboardContext = createContext();

function dashboardReducer(state, action) {
  switch (action.type) {
    case 'SET_WIDGETS_FOR_CATEGORY': {
      const { categoryId, widgetIds } = action.payload;
      return {
        ...state,
        layout: state.layout.map(cat =>
          cat.id === categoryId ? { ...cat, widgets: widgetIds } : cat
        ),
      };
    }
    case 'REMOVE_WIDGET': {
      const { categoryId, widgetId } = action.payload;
      return {
        ...state,
        layout: state.layout.map(cat =>
          cat.id === categoryId
            ? { ...cat, widgets: cat.widgets.filter(id => id !== widgetId) }
            : cat
        ),
      };
    }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

const DashboardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dashboardReducer, dashboardData);
  const value = { state, dispatch };
  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}

// --- 4. WIDGET COMPONENTS with CHARTS ---

const LegendItem = ({ color, text }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
        <Box sx={{ width: 12, height: 12, backgroundColor: color, borderRadius: '2px', mr: 1 }} />
        <Typography variant="body2">{text}</Typography>
    </Box>
);

const PlaceholderWidget = ({ title }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.secondary', p: 2 }}>
    <Typography>No Graph data available for {title}</Typography>
  </Box>
);

const cloudAccountsData = [{ name: 'Connected', value: 2 }, { name: 'Not Connected', value: 2 }];
const cloudAccountsColors = ['#4e73df', '#d1d9e6'];
const CloudAccountsWidget = () => (
    <Grid container spacing={2} sx={{ height: '100%', alignItems: 'center' }}>
        <Grid item xs={6}>
            <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                    <Pie data={cloudAccountsData} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={60}>
                        {cloudAccountsData.map((entry, index) => <Cell key={`cell-${index}`} fill={cloudAccountsColors[index % cloudAccountsColors.length]} />)}
                    </Pie>
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="24" fontWeight="bold">4</text>
                </PieChart>
            </ResponsiveContainer>
        </Grid>
        <Grid item xs={6}><Stack>
            <LegendItem color={cloudAccountsColors[0]} text={`Connected (${cloudAccountsData[0].value})`} />
            <LegendItem color={cloudAccountsColors[1]} text={`Not Connected (${cloudAccountsData[1].value})`} />
        </Stack></Grid>
    </Grid>
);

const riskData = [{ name: 'Passed', value: 7253 }, { name: 'Failed', value: 1089 }, { name: 'Warning', value: 68 }, { name: 'Not available', value: 38 }];
const riskColors = ['#1cc88a', '#e74a3b', '#f6c23e', '#858796'];
const RiskAssessmentWidget = () => (
    <Grid container spacing={2} sx={{ height: '100%', alignItems: 'center' }}>
        <Grid item xs={6}>
            <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                    <Pie data={riskData} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={60}>
                        {riskData.map((entry, index) => <Cell key={`cell-${index}`} fill={riskColors[index % riskColors.length]} />)}
                    </Pie>
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="18" fontWeight="bold">9659</text>
                </PieChart>
            </ResponsiveContainer>
        </Grid>
        <Grid item xs={6}><Stack>
            {riskData.map((item, i) => <LegendItem key={i} color={riskColors[i]} text={`${item.name} (${item.value})`} />)}
        </Stack></Grid>
    </Grid>
);

const CustomBar = ({ x, y, width, height, fill }) => (<rect x={x} y={y} width={width} height={height} rx={5} ry={5} fill={fill} />);

const ImageRiskWidget = () => {
    const data = [{ name: 'Risk', Critical: 4, High: 752, Low: 714 }];
    return (<Box sx={{ p: 2 }}>
        <Typography variant="h5" component="p" fontWeight="bold">1470 <Typography variant="body2" component="span">Total vulnerabilities</Typography></Typography>
        <ResponsiveContainer width="100%" height={60}>
            <BarChart data={data} layout="vertical" stackOffset="expand">
                <XAxis type="number" hide /><YAxis type="category" dataKey="name" hide />
                <Bar dataKey="Critical" fill="#e74a3b" stackId="a" shape={<CustomBar />} />
                <Bar dataKey="High" fill="#f6c23e" stackId="a" shape={<CustomBar />} />
                <Bar dataKey="Low" fill="#4e73df" stackId="a" shape={<CustomBar />} />
            </BarChart>
        </ResponsiveContainer>
        <Stack direction="row" spacing={2} mt={1}>
            <LegendItem color="#e74a3b" text="Critical (4)" />
            <LegendItem color="#f6c23e" text="High (752)" />
        </Stack>
    </Box>);
};
const ImageSecurityWidget = () => {
    const data = [{ name: 'Issues', Critical: 1, High: 2 }];
    return (<Box sx={{ p: 2 }}>
        <Typography variant="h5" component="p" fontWeight="bold">2 <Typography variant="body2" component="span">Total images</Typography></Typography>
        <ResponsiveContainer width="100%" height={60}>
            <BarChart data={data} layout="vertical" stackOffset="expand">
                <XAxis type="number" hide /><YAxis type="category" dataKey="name" hide />
                <Bar dataKey="Critical" fill="#e74a3b" stackId="a" shape={<CustomBar />} />
                <Bar dataKey="High" fill="#f6c23e" stackId="a" shape={<CustomBar />} />
            </BarChart>
        </ResponsiveContainer>
        <Stack direction="row" spacing={2} mt={1}>
            <LegendItem color="#e74a3b" text="Critical (1)" />
            <LegendItem color="#f6c23e" text="High (2)" />
        </Stack>
    </Box>);
};

const widgetComponentMap = { CloudAccountsWidget, RiskAssessmentWidget, ImageRiskWidget, ImageSecurityWidget, PlaceholderWidget };

// --- 5. CORE UI COMPONENTS ---

const Widget = ({ categoryId, widgetId }) => {
  const { state, dispatch } = useDashboard();
  const widget = state.availableWidgets[widgetId];
  if (!widget) return null;
  const SpecificWidgetComponent = widgetComponentMap[widget.component] || PlaceholderWidget;
  const handleRemove = () => dispatch({ type: 'REMOVE_WIDGET', payload: { categoryId, widgetId } });

  return (
    <Card variant="outlined">
      <CardHeader title={widget.title} action={<IconButton onClick={handleRemove}><CloseIcon /></IconButton>} />
      <CardContent sx={{ flexGrow: 1, p: 1 }}><SpecificWidgetComponent title={widget.title} /></CardContent>
    </Card>
  );
};

const AddWidgetModal = ({ open, handleClose, categoryId }) => {
    const { state, dispatch } = useDashboard();
    const { availableWidgets, layout } = state;
    const categoryWidgets = layout.find(c => c.id === categoryId)?.widgets || [];
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedWidgets, setSelectedWidgets] = useState(new Set(categoryWidgets));

    useEffect(() => { setSelectedWidgets(new Set(categoryWidgets)); }, [open, categoryWidgets]);

    const handleConfirm = () => {
        dispatch({ type: 'SET_WIDGETS_FOR_CATEGORY', payload: { categoryId, widgetIds: Array.from(selectedWidgets) } });
        handleClose();
    };
    
    const filteredWidgets = useMemo(() => Object.values(availableWidgets).filter(widget =>
        widget.title.toLowerCase().includes(searchTerm.toLowerCase())),
        [availableWidgets, searchTerm]
    );
  
    return (
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Personalise Your Dashboard</DialogTitle>
        <DialogContent>
          <TextField fullWidth variant="outlined" placeholder="Search widgets..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }} sx={{ mb: 2 }}
          />
          <FormGroup>
            {filteredWidgets.map(widget => (
              <FormControlLabel key={widget.id} label={widget.title} control={<Checkbox
                checked={selectedWidgets.has(widget.id)}
                onChange={() => {
                  const newSelection = new Set(selectedWidgets);
                  if (newSelection.has(widget.id)) newSelection.delete(widget.id); else newSelection.add(widget.id);
                  setSelectedWidgets(newSelection);
                }}
              />} />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirm} variant="contained">Confirm</Button>
        </DialogActions>
      </Dialog>
    );
};
  
const Category = ({ id, title, widgets }) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <Box sx={{ mb: 5 }}>
      <Typography variant="h6" component="h2" gutterBottom>{title}</Typography>
      <Grid container spacing={3}>
        {(widgets || []).map((widgetId) => (
          <Grid item xs={12} md={6} lg={4} key={widgetId}><Widget categoryId={id} widgetId={widgetId} /></Grid>
        ))}
        <Grid item xs={12} md={6} lg={4}>
          <Button variant="dashed" onClick={() => setModalOpen(true)} startIcon={<AddIcon />}
            sx={{ width: '100%', height: '100%', minHeight: '200px', border: '2px dashed #c4cdd5', color: 'text.secondary', '&:hover': { backgroundColor: '#f4f6f8' } }}
          >Add Widget</Button>
        </Grid>
      </Grid>
      <AddWidgetModal open={modalOpen} handleClose={() => setModalOpen(false)} categoryId={id} />
    </Box>
  );
};

const DashboardPage = () => {
    const { state } = useDashboard();
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4 }}>CNAPP Dashboard</Typography>
        {state.layout.map((category) => <Category key={category.id} {...category} />)}
      </Container>
    );
};

// --- 6. ROOT APP COMPONENT ---

function App() {
    return (
        <DashboardProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <DashboardPage />
            </ThemeProvider>
        </DashboardProvider>
    );
}

export default App;
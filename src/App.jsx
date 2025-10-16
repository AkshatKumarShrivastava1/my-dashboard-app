import React, { createContext, useContext, useReducer, useMemo, useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Container, Typography, Grid, Card, CardContent, CardHeader, IconButton, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, FormGroup, FormControlLabel,
  Checkbox, TextField, InputAdornment, Box, CssBaseline, ThemeProvider, createTheme, Stack,
  Select, MenuItem, Tabs, Tab, Breadcrumbs, Link
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RefreshIcon from '@mui/icons-material/Refresh';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
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
    h4: { fontWeight: 700 }, h5: { fontWeight: 600 }, h6: { fontWeight: 600 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: 'rgba(149, 157, 165, 0.1) 0px 8px 24px',
          height: '100%', display: 'flex', flexDirection: 'column'
        }
      }
    },
    MuiCardHeader: { styleOverrides: { title: { fontSize: '1rem', fontWeight: 600 } } },
    MuiButton: { styleOverrides: { root: { textTransform: 'none', borderRadius: '8px' } } },
  }
});

// --- 2. DATA SOURCE ---

const dashboardData = {
  layout: [
    { id: "cat_cspm", title: "CSPM Executive Dashboard", widgets: ["widget_cloud_accounts", "widget_cloud_risk"] },
    { id: "cat_cwpp", title: "CWPP Dashboard", widgets: [] },
    { id: "cat_registry", title: "Registry Scan", widgets: ["widget_image_risk", "widget_image_security"] },
  ],
  availableWidgets: {
    widget_cloud_accounts: { id: "widget_cloud_accounts", title: "Cloud Accounts", category: "CSPM", component: "CloudAccountsWidget" },
    widget_cloud_risk: { id: "widget_cloud_risk", title: "Cloud Account Risk Assessment", category: "CSPM", component: "RiskAssessmentWidget" },
    widget_namespace_alerts: { id: "widget_namespace_alerts", title: "Top 5 Namespace Specific Alerts", category: "CWPP", component: "PlaceholderWidget" },
    widget_workload_alerts: { id: "widget_workload_alerts", title: "Workload Alerts", category: "CWPP", component: "PlaceholderWidget" },
    widget_image_risk: { id: "widget_image_risk", title: "Image Risk Assessment", category: "Image", component: "ImageRiskWidget" },
    widget_image_security: { id: "widget_image_security", title: "Image Security Issues", category: "Image", component: "ImageSecurityWidget" },
    widget_compliance_status: { id: "widget_compliance_status", title: "Compliance Status", category: "CSPM", component: "PlaceholderWidget" },
    widget_ticket_1: { id: "widget_ticket_1", title: "Ticket Widget 1", category: "Ticket", component: "PlaceholderWidget" },
    widget_ticket_2: { id: "widget_ticket_2", title: "Ticket Widget 2", category: "Ticket", component: "PlaceholderWidget" },
  },
};

// --- 3. STATE MANAGEMENT (React Context & Reducer) ---

const DashboardContext = createContext();

function dashboardReducer(state, action) {
  switch (action.type) {
    case 'SET_LAYOUT':
      return { ...state, layout: action.payload };
    case 'REMOVE_WIDGET': {
      const { categoryId, widgetId } = action.payload;
      return { ...state, layout: state.layout.map(cat => cat.id === categoryId ? { ...cat, widgets: cat.widgets.filter(id => id !== widgetId) } : cat) };
    }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

const DashboardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dashboardReducer, dashboardData);
  return <DashboardContext.Provider value={{ state, dispatch }}>{children}</DashboardContext.Provider>;
}

const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) throw new Error('useDashboard must be used within a DashboardProvider');
  return context;
}

// --- 4. WIDGET COMPONENTS with CHARTS ---

const LegendItem = ({ color, text }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
    <Box sx={{ width: 12, height: 12, backgroundColor: color, borderRadius: '2px', mr: 1 }} />
    <Typography variant="body2">{text}</Typography>
  </Box>
);
const PlaceholderWidget = ({ title }) => (<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.secondary', p: 2 }}><Typography>No Graph data available</Typography></Box>);
const cloudAccountsData = [{ name: 'Connected', value: 2 }, { name: 'Not Connected', value: 2 }];
const cloudAccountsColors = ['#4e73df', '#d1d9e6'];
const CloudAccountsWidget = () => (
    <Grid container spacing={2} sx={{ height: '100%', alignItems: 'center' }}><Grid item xs={6}><ResponsiveContainer width="100%" height={150}><PieChart><Pie data={cloudAccountsData} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={60}>{cloudAccountsData.map((entry, index) => <Cell key={`cell-${index}`} fill={cloudAccountsColors[index % cloudAccountsColors.length]} />)}</Pie><text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="24" fontWeight="bold">4</text></PieChart></ResponsiveContainer></Grid><Grid item xs={6}><Stack><LegendItem color={cloudAccountsColors[0]} text={`Connected (2)`} /><LegendItem color={cloudAccountsColors[1]} text={`Not Connected (2)`} /></Stack></Grid></Grid>
);
const riskData = [{ name: 'Passed', value: 7253 }, { name: 'Failed', value: 1089 }, { name: 'Warning', value: 68 }, { name: 'Not available', value: 38 }];
const riskColors = ['#1cc88a', '#e74a3b', '#f6c23e', '#858796'];
const RiskAssessmentWidget = () => (
    <Grid container spacing={2} sx={{ height: '100%', alignItems: 'center' }}><Grid item xs={6}><ResponsiveContainer width="100%" height={150}><PieChart><Pie data={riskData} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={60}>{riskData.map((entry, index) => <Cell key={`cell-${index}`} fill={riskColors[index % riskColors.length]} />)}</Pie><text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="18" fontWeight="bold">9659</text></PieChart></ResponsiveContainer></Grid><Grid item xs={6}><Stack>{riskData.map((item, i) => <LegendItem key={i} color={riskColors[i]} text={`${item.name} (${item.value})`} />)}</Stack></Grid></Grid>
);
const CustomBar = ({ x, y, width, height, fill }) => (<rect x={x} y={y} width={width} height={height} rx={5} ry={5} fill={fill} />);
const ImageRiskWidget = () => (<Box sx={{ p: 2 }}><Typography variant="h5" component="p" fontWeight="bold">1470 <Typography variant="body2" component="span">Total vulnerabilities</Typography></Typography><ResponsiveContainer width="100%" height={60}><BarChart data={[{ name: 'Risk', Critical: 4, High: 752, Low: 714 }]} layout="vertical" stackOffset="expand"><XAxis type="number" hide /><YAxis type="category" dataKey="name" hide /><Bar dataKey="Critical" fill="#e74a3b" stackId="a" shape={<CustomBar />} /><Bar dataKey="High" fill="#f6c23e" stackId="a" shape={<CustomBar />} /><Bar dataKey="Low" fill="#4e73df" stackId="a" shape={<CustomBar />} /></BarChart></ResponsiveContainer><Stack direction="row" spacing={2} mt={1}><LegendItem color="#e74a3b" text="Critical (4)" /><LegendItem color="#f6c23e" text="High (752)" /></Stack></Box>);
const ImageSecurityWidget = () => (<Box sx={{ p: 2 }}><Typography variant="h5" component="p" fontWeight="bold">2 <Typography variant="body2" component="span">Total images</Typography></Typography><ResponsiveContainer width="100%" height={60}><BarChart data={[{ name: 'Issues', Critical: 1, High: 2 }]} layout="vertical" stackOffset="expand"><XAxis type="number" hide /><YAxis type="category" dataKey="name" hide /><Bar dataKey="Critical" fill="#e74a3b" stackId="a" shape={<CustomBar />} /><Bar dataKey="High" fill="#f6c23e" stackId="a" shape={<CustomBar />} /></BarChart></ResponsiveContainer><Stack direction="row" spacing={2} mt={1}><LegendItem color="#e74a3b" text="Critical (1)" /><LegendItem color="#f6c23e" text="High (2)" /></Stack></Box>);
const widgetComponentMap = { CloudAccountsWidget, RiskAssessmentWidget, ImageRiskWidget, ImageSecurityWidget, PlaceholderWidget };

// --- 5. CORE UI COMPONENTS ---

const Widget = ({ categoryId, widgetId }) => {
  const { state, dispatch } = useDashboard();
  const widget = state.availableWidgets[widgetId];
  if (!widget) return null;
  const SpecificWidgetComponent = widgetComponentMap[widget.component] || PlaceholderWidget;
  const handleRemove = () => dispatch({ type: 'REMOVE_WIDGET', payload: { categoryId, widgetId } });
  return (<Card variant="outlined"><CardHeader title={widget.title} action={<IconButton onClick={handleRemove}><CloseIcon /></IconButton>} /><CardContent sx={{ flexGrow: 1, p: 1 }}><SpecificWidgetComponent title={widget.title} /></CardContent></Card>);
};

const PersonalizeDashboardModal = ({ open, handleClose, initialTab = 0 }) => {
    const { state, dispatch } = useDashboard();
    const [tabIndex, setTabIndex] = useState(0);
    const [selectedWidgets, setSelectedWidgets] = useState({});

    useEffect(() => {
        if(open) {
            setTabIndex(initialTab);
            const initialSelection = {};
            state.layout.forEach(cat => {
                initialSelection[cat.id] = new Set(cat.widgets);
            });
            setSelectedWidgets(initialSelection);
        }
    }, [open, state.layout, initialTab]);
    
    const categories = useMemo(() => {
        const cats = {};
        Object.values(state.availableWidgets).forEach(w => {
            if(!cats[w.category]) cats[w.category] = { name: w.category, widgets: [] };
            cats[w.category].widgets.push(w);
        });
        const categoryIdMap = { "CSPM": "cat_cspm", "CWPP": "cat_cwpp", "Image": "cat_registry", "Ticket": "cat_ticket" };
        const orderedCats = ["CSPM", "CWPP", "Image", "Ticket"];
        return orderedCats.filter(catName => cats[catName]).map(catName => ({...cats[catName], id: categoryIdMap[catName]}));
    }, [state.availableWidgets]);

    const handleConfirm = () => {
        const layoutWithAllCats = categories.map(c => {
            const existing = state.layout.find(l => l.id === c.id);
            return existing || { id: c.id, title: c.name + " Dashboard", widgets: [] };
        });

        const newLayout = layoutWithAllCats.map(cat => ({
            ...cat,
            widgets: selectedWidgets[cat.id] ? Array.from(selectedWidgets[cat.id]) : []
        }));
        
        dispatch({ type: 'SET_LAYOUT', payload: newLayout });
        handleClose();
    };

    const handleWidgetToggle = (categoryId, widgetId) => {
        setSelectedWidgets(prev => {
            const newSelection = { ...prev };
            if (!newSelection[categoryId]) newSelection[categoryId] = new Set();
            const categorySet = new Set(newSelection[categoryId]);
            if (categorySet.has(widgetId)) {
                categorySet.delete(widgetId);
            } else {
                categorySet.add(widgetId);
            }
            newSelection[categoryId] = categorySet;
            return newSelection;
        });
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Personalise your dashboard</DialogTitle>
            <DialogContent>
                <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    {categories.map(c => <Tab key={c.name} label={c.name} />)}
                </Tabs>
                {categories.map((cat, index) => (
                    <Box key={cat.id} hidden={tabIndex !== index} sx={{ pt: 2 }}>
                        <FormGroup>
                            {cat.widgets.map(widget => (
                                <FormControlLabel key={widget.id} label={widget.title} control={<Checkbox
                                    checked={selectedWidgets[cat.id]?.has(widget.id) || false}
                                    onChange={() => handleWidgetToggle(cat.id, widget.id)}
                                />} />
                            ))}
                        </FormGroup>
                    </Box>
                ))}
            </DialogContent>
            <DialogActions sx={{ p: '16px 24px' }}>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleConfirm} variant="contained">Confirm</Button>
            </DialogActions>
        </Dialog>
    );
};

const Category = ({ id, title, widgets, onAddWidgetClick }) => (
    <Box sx={{ mb: 5 }}>
        <Typography variant="h6" component="h2" gutterBottom>{title}</Typography>
        <Grid container spacing={3}>
            {(widgets || []).map((widgetId) => (
                <Grid item xs={12} md={6} lg={4} key={widgetId}><Widget categoryId={id} widgetId={widgetId} /></Grid>
            ))}
            <Grid item xs={12} md={6} lg={4}>
                <Button
                    variant="outlined"
                    onClick={onAddWidgetClick}
                    startIcon={<AddIcon />}
                    sx={{ 
                        width: '100%', height: '100%', minHeight: '200px',
                        borderStyle: 'dashed', borderWidth: '2px', color: 'text.secondary',
                        '&:hover': { borderWidth: '2px' }
                    }}
                >
                    Add Widget
                </Button>
            </Grid>
        </Grid>
    </Box>
);

const DashboardHeader = ({ onAddWidgetClick }) => (
    <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ flexGrow: 1 }}>
                <Link underline="hover" color="inherit" href="#" sx={{ display: 'flex', alignItems: 'center' }}>
                    <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    Home
                </Link>
                <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <DashboardIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    Dashboard
                </Typography>
            </Breadcrumbs>
            <Stack direction="row" spacing={1} alignItems="center">
                <TextField variant="outlined" size="small" placeholder="Search..." InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }} />
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => onAddWidgetClick(0)}>Add Widget</Button>
                <IconButton><RefreshIcon /></IconButton>
                <Select size="small" defaultValue="last_2_days">
                    <MenuItem value="last_2_days">Last 2 days</MenuItem>
                    <MenuItem value="last_7_days">Last 7 days</MenuItem>
                    <MenuItem value="last_30_days">Last 30 days</MenuItem>
                </Select>
            </Stack>
        </Toolbar>
    </AppBar>
);

const DashboardPage = () => {
    const { state } = useDashboard();
    const [modalOpen, setModalOpen] = useState(false);
    const [initialModalTab, setInitialModalTab] = useState(0);

    const handleAddWidgetClick = (tabIndex) => {
        setInitialModalTab(tabIndex);
        setModalOpen(true);
    };

    return (
        <>
            <DashboardHeader onAddWidgetClick={handleAddWidgetClick} />
            <Container maxWidth="xl" sx={{ mt: 4 }}>
                <Typography variant="h5" sx={{mb: 1}}>Dashboard V2</Typography>
                <Typography variant="h4" component="h1" sx={{ mb: 4 }}>CNAPP Dashboard</Typography>
                {state.layout.map((category, index) => <Category key={category.id} {...category} onAddWidgetClick={() => handleAddWidgetClick(index)} />)}
            </Container>
            <PersonalizeDashboardModal open={modalOpen} handleClose={() => setModalOpen(false)} initialTab={initialModalTab} />
        </>
    );
};

// --- 6. ROOT APP COMPONENT ---

function App() {
    return (
        <DashboardProvider>
            <ThemeProvider theme={theme}>
                <Box sx={{ bgcolor: 'background.default' }}>
                    <CssBaseline />
                    <DashboardPage />
                </Box>
            </ThemeProvider>
        </DashboardProvider>
    );
}

export default App;

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  alpha,
  IconButton,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  CalendarMonth,
} from "@mui/icons-material";
import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import GanapatiImg from "../assets/ganapati.jpg";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar.css";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// ── Event type colors ────────────────────────────────────
const EVENT_COLORS = {
  contribution: { bg: "#FDDCCC", text: "#D84315", border: "#FFAB91" },
  investment: { bg: "#E8D5F5", text: "#7B1FA2", border: "#CE93D8" },
  event: { bg: "#FCE4EC", text: "#C62828", border: "#EF9A9A" },
};

// ── Demo events matching reference screenshot ────────────
const DEMO_EVENTS = [
  { id: 1, title: "Amit ₹20,000", start: new Date(2026, 2, 5), end: new Date(2026, 2, 5), type: "contribution" },
  { id: 2, title: "Investment ₹8,000", start: new Date(2026, 2, 10), end: new Date(2026, 2, 10), type: "investment" },
  { id: 3, title: "Meeting", start: new Date(2026, 2, 15), end: new Date(2026, 2, 15), type: "event" },
  { id: 4, title: "Priya ₹9,000", start: new Date(2026, 2, 22), end: new Date(2026, 2, 22), type: "event" },
  { id: 5, title: "Puja Planning", start: new Date(2026, 2, 28), end: new Date(2026, 2, 28), type: "event" },
  { id: 6, title: "New Month Target", start: new Date(2026, 3, 1), end: new Date(2026, 3, 1), type: "event" },
];

// ── Legend dot ────────────────────────────────────────────
const LegendDot = ({ color, label }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
    <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: color }} />
    <Typography variant="caption" sx={{ fontWeight: 500, color: "text.secondary", fontSize: "0.75rem" }}>
      {label}
    </Typography>
  </Box>
);

// ── Custom event component ───────────────────────────────
const EventComponent = ({ event }) => {
  const colors = EVENT_COLORS[event.type] || EVENT_COLORS.event;
  return (
    <Box
      sx={{
        bgcolor: colors.bg,
        color: colors.text,
        borderLeft: `3px solid ${colors.border}`,
        borderRadius: "4px",
        px: 0.8,
        py: 0.2,
        fontSize: "0.72rem",
        fontWeight: 500,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        lineHeight: 1.6,
        cursor: "pointer",
        transition: "all 0.15s ease",
        "&:hover": { filter: "brightness(0.95)", transform: "translateY(-1px)" },
      }}
    >
      {event.title}
    </Box>
  );
};

// ── Custom toolbar ───────────────────────────────────────
const CustomToolbar = ({ label, onNavigate, onView, view }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const viewMap = [
    { value: "month", label: "Month" },
    { value: "week", label: "Week" },
    { value: "day", label: "Day" },
    { value: "agenda", label: "Agenda" },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 1.5,
        p: "10px 16px",
        mb: 1.5,
        bgcolor: "#fff",
        borderRadius: 2,
        boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
      }}
    >
      {/* Left: Today + Nav arrows */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => onNavigate("TODAY")}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.8rem",
            borderColor: alpha(theme.palette.primary.main, 0.3),
            color: theme.palette.text.primary,
            borderRadius: 1.5,
            px: 2,
            py: 0.4,
            "&:hover": { borderColor: theme.palette.primary.main, bgcolor: alpha(theme.palette.primary.main, 0.04) },
          }}
        >
          Today
        </Button>
        <IconButton
          size="small"
          onClick={() => onNavigate("PREV")}
          sx={{ border: `1px solid ${alpha("#000", 0.12)}`, borderRadius: 1.5, width: 32, height: 32 }}
        >
          <ChevronLeft fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onNavigate("NEXT")}
          sx={{ border: `1px solid ${alpha("#000", 0.12)}`, borderRadius: 1.5, width: 32, height: 32 }}
        >
          <ChevronRight fontSize="small" />
        </IconButton>
      </Box>

      {/* Center: Month label */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
        <CalendarMonth sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
        <Typography
          variant={isMobile ? "subtitle1" : "h6"}
          sx={{ fontWeight: 700, color: theme.palette.text.primary }}
        >
          {label}
        </Typography>
      </Box>

      {/* Right: View toggle */}
      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={(_, v) => v && onView(v)}
        size="small"
        sx={{
          "& .MuiToggleButton-root": {
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.75rem",
            px: { xs: 1, sm: 1.5 },
            py: 0.4,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
            color: theme.palette.text.secondary,
            "&.Mui-selected": {
              bgcolor: theme.palette.primary.main,
              color: "#fff",
              borderColor: theme.palette.primary.main,
              "&:hover": { bgcolor: theme.palette.primary.dark },
            },
          },
        }}
      >
        {viewMap.map((v) => (
          <ToggleButton key={v.value} value={v.value}>
            {isMobile ? v.label.charAt(0) : v.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

// ── Main Component ───────────────────────────────────────
const EventCalendar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isCompact = useMediaQuery(theme.breakpoints.down("md"));
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState("month");

  // Build events from Redux data + demo fallback
  const getContributedDetails = useSelector((state) => state.role.getContributedDetails);
  const investmentRequests = useSelector((state) => state.role.investMentRequestsData);
  const hasRealData = (getContributedDetails?.data?.length || 0) > 0;

  const events = hasRealData
    ? [
        ...(getContributedDetails?.data || []).map((c, i) => ({
          id: `c_${i}`,
          title: `${c.donor_name || c.fullName || "Donor"} ₹${Number(c.amount || 0).toLocaleString("en-IN")}`,
          start: new Date(c.date || c.timestamp || c.createdAt),
          end: new Date(c.date || c.timestamp || c.createdAt),
          type: "contribution",
        })),
        ...(investmentRequests?.data || []).map((inv, i) => ({
          id: `i_${i}`,
          title: `${inv.title || "Investment"} ₹${Number(inv.amount || 0).toLocaleString("en-IN")}`,
          start: new Date(inv.date || inv.timestamp || inv.createdAt),
          end: new Date(inv.date || inv.timestamp || inv.createdAt),
          type: "investment",
        })),
      ]
    : DEMO_EVENTS;

  const handleEventClick = useCallback((event) => {
    // Future: open detail dialog
  }, []);

  const eventStyleGetter = useCallback((event) => {
    return { style: { background: "transparent", border: "none", padding: 0, boxShadow: "none" } };
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: isCompact ? "auto" : "100%",
        overflow: isCompact ? "auto" : "hidden",
        p: { xs: 0.5, sm: 1, md: 1.5 },
        gap: 1,
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
        <img src={GanapatiImg} width="32px" style={{ borderRadius: 6 }} alt="" />
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              lineHeight: 1.2,
              background: "linear-gradient(45deg, #FF6B35, #D32F2F)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Calendar
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Events & contribution schedule
          </Typography>
        </Box>
      </Box>

      {/* Calendar */}
      <Box
        className="mandal-calendar"
        sx={{
          flex: 1,
          minHeight: isCompact ? 500 : 0,
          "& .rbc-calendar": { height: "100% !important" },
        }}
      >
        <Calendar
          localizer={localizer}
          date={date}
          view={view}
          events={events}
          onNavigate={(newDate) => setDate(newDate)}
          onView={(newView) => setView(newView)}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          eventPropGetter={eventStyleGetter}
          components={{
            toolbar: CustomToolbar,
            event: EventComponent,
          }}
          onSelectEvent={handleEventClick}
          popup
        />
      </Box>

      {/* Legend */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 3,
          flexShrink: 0,
          pt: 0.5,
          pb: 0.5,
        }}
      >
        <LegendDot color={EVENT_COLORS.contribution.border} label="Contribution" />
        <LegendDot color={EVENT_COLORS.investment.border} label="Investment" />
        <LegendDot color="#FFA726" label="Event" />
      </Box>
    </Box>
  );
};

export default EventCalendar;

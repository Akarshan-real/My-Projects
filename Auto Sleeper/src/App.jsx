import React, { useState, useEffect } from 'react';
import Counter from '@/components/Counter';
import { MultiStepLoader } from '@/components/ui/multi-step-loader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button as StatefulButton } from '@/components/ui/stateful-button';
import { Plus, Trash2 } from 'lucide-react';

const App = () => {
    const [config, setConfig] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState(0);
    const [customMinutes, setCustomMinutes] = useState('');
    const [uiState, setUiState] = useState('idle'); // idle, running, running-test
    const [statusMessage, setStatusMessage] = useState('');
    const [currentSeconds, setCurrentSeconds] = useState(0);
    const [newAppName, setNewAppName] = useState('');
    const [newAppProcess, setNewAppProcess] = useState('');



    useEffect(() => {
        if (window.api) {
            // Load config initially
            window.api.getConfig().then(c => {
                setConfig(c);
            });

            // Set up IPC listeners
            window.api.onTick((seconds) => {
                setCurrentSeconds(seconds);
            });

            window.api.onExecuting((status) => {
                setStatusMessage(status);
            });

            window.api.onCompleted((message) => {
                setStatusMessage(message);
                setUiState('idle');
            });

            window.api.onStopped(() => {
                setStatusMessage('Timer cancelled.');
                setUiState('idle');
                setTimeout(() => setStatusMessage(''), 3000);
            });
        }
    }, []);

    const updateConfig = (newConfig) => {
        setConfig(newConfig);
        if (window.api) window.api.updateConfig(newConfig);
    };

    const handleActionChange = (value) => {
        if (!config) return;
        const newConfig = { ...config, defaultAction: value };
        updateConfig(newConfig);
    };

    const handleAppToggle = (index, enabled) => {
        if (!config) return;
        const newConfig = { ...config };
        newConfig.targetApplications[index].enabled = enabled;
        updateConfig(newConfig);
    };

    const handleAddApp = () => {
        if (!config || !newAppName.trim() || !newAppProcess.trim()) return;
        const newConfig = { ...config };
        newConfig.targetApplications = [
            ...newConfig.targetApplications,
            { name: newAppName.trim(), process: newAppProcess.trim(), enabled: true }
        ];
        updateConfig(newConfig);
        setNewAppName('');
        setNewAppProcess('');
    };

    const handleDeleteApp = (index) => {
        if (!config) return;
        const newConfig = { ...config };
        newConfig.targetApplications = newConfig.targetApplications.filter((_, i) => i !== index);
        updateConfig(newConfig);
    };

    const handlePresetClick = (seconds) => {
        setCustomMinutes('');
        setSelectedDuration(seconds);
        setCurrentSeconds(seconds);
    };

    const handleCustomMinutesChange = (e) => {
        const val = e.target.value;
        setCustomMinutes(val);
        const mins = parseInt(val, 10);
        if (!isNaN(mins) && mins > 0) {
            setSelectedDuration(mins * 60);
            setCurrentSeconds(mins * 60);
        } else {
            setSelectedDuration(0);
            setCurrentSeconds(0);
        }
    };

    const incrementCustomMinutes = () => {
        let current = parseInt(customMinutes, 10);
        if (isNaN(current)) {
            current = Math.floor(selectedDuration / 60);
        }
        const newVal = current + 1;
        setCustomMinutes(newVal.toString());
        setSelectedDuration(newVal * 60);
        setCurrentSeconds(newVal * 60);
    };

    const decrementCustomMinutes = () => {
        let current = parseInt(customMinutes, 10);
        if (isNaN(current)) {
            current = Math.floor(selectedDuration / 60);
        }
        if (current <= 0) return;
        const newVal = current - 1;
        setCustomMinutes(newVal.toString());
        setSelectedDuration(newVal * 60);
        setCurrentSeconds(newVal * 60);
    };

    const startTimer = async () => {
        if (selectedDuration <= 0) {
            alert('Please select a valid duration.');
            return;
        }
        if (window.api) window.api.startTimer(selectedDuration, config, false);
        setUiState('running');
        setStatusMessage('');
    };

    const startTestMode = () => {
        const testDuration = 5;
        setSelectedDuration(testDuration);
        setCurrentSeconds(testDuration);
        if (window.api) window.api.startTimer(testDuration, config, true);
        setUiState('running-test');
        setStatusMessage('');
    };

    const cancelTimer = () => {
        if (window.api) window.api.stopTimer();
    };

    if (!config) return <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>Loading...</div>;

    const isRunning = uiState === 'running' || uiState === 'running-test';
    const displaySeconds = isRunning ? currentSeconds : selectedDuration;

    const h = Math.floor(displaySeconds / 3600);
    const m = Math.floor((displaySeconds % 3600) / 60);
    const s = displaySeconds % 60;

    const loadingStates = [
        { text: "Timer started" },
        { text: "Waiting..." },
        { text: "Closing target applications" },
        { text: `Executing ${config.defaultAction}` }
    ];

    return (
        <div className="app-container relative">
            <MultiStepLoader loadingStates={loadingStates} loading={uiState === 'running-test'} duration={1250} />

            <header>
                <h1>Auto Sleeper</h1>
                <p>Smart shutdown automation</p>
            </header>

            <main>
                <section className="card timer-section">
                    <h2>Set Timer</h2>
                    <div className="timer-display flex items-center justify-center text-(--color-primary) font-bold text-5xl my-8">
                        <Counter value={h} places={[10, 1]} fontSize={48} gradientHeight={0} textColor="var(--color-primary)" />:
                        <Counter value={m} places={[10, 1]} fontSize={48} gradientHeight={0} textColor="var(--color-primary)" />:
                        <Counter value={s} places={[10, 1]} fontSize={48} gradientHeight={0} textColor="var(--color-primary)" />
                    </div>

                    <div className="duration-controls" id="duration-controls">
                        <button
                            className={`h-10.5 px-4 rounded-md border transition-all duration-200 font-medium ${selectedDuration === 1800 && customMinutes === '' ? 'border-(--color-primary) text-(--color-primary) bg-(--color-surface-elevated)' : 'border-(--color-hairline) bg-(--color-canvas) text-(--color-ink) hover:border-(--color-primary) hover:text-(--color-primary)'}`}
                            onClick={() => handlePresetClick(1800)}
                            disabled={isRunning}
                        >30m</button>
                        <button
                            className={`h-10.5 px-4 rounded-md border transition-all duration-200 font-medium ${selectedDuration === 3600 && customMinutes === '' ? 'border-(--color-primary) text-(--color-primary) bg-(--color-surface-elevated)' : 'border-(--color-hairline) bg-(--color-canvas) text-(--color-ink) hover:border-(--color-primary) hover:text-(--color-primary)'}`}
                            onClick={() => handlePresetClick(3600)}
                            disabled={isRunning}
                        >1h</button>
                        <button
                            className={`h-10.5 px-4 rounded-md border transition-all duration-200 font-medium ${selectedDuration === 7200 && customMinutes === '' ? 'border-(--color-primary) text-(--color-primary) bg-(--color-surface-elevated)' : 'border-(--color-hairline) bg-(--color-canvas) text-(--color-ink) hover:border-(--color-primary) hover:text-(--color-primary)'}`}
                            onClick={() => handlePresetClick(7200)}
                            disabled={isRunning}
                        >2h</button>
                        <div className="custom-time">
                            <div className="flex items-center gap-1">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            type="button"
                                            onClick={decrementCustomMinutes}
                                            disabled={isRunning || (customMinutes === '' ? Math.floor(selectedDuration / 60) <= 0 : Number(customMinutes) <= 0)}
                                            className="flex items-center justify-center h-10.5 w-10.5 rounded-md border border-(--color-hairline) bg-(--color-canvas) text-(--color-ink) hover:border-(--color-primary) hover:text-(--color-primary) transition-colors disabled:opacity-50 cursor-pointer shrink-0"
                                        >
                                            -
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Decrement</p>
                                    </TooltipContent>
                                </Tooltip>
                                
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <input
                                            type="number"
                                            id="custom-minutes"
                                            placeholder="Custom (min)"
                                            min="1"
                                            value={customMinutes}
                                            onChange={handleCustomMinutesChange}
                                            disabled={isRunning}
                                            className="bg-(--color-canvas) border-(--color-hairline) border text-(--color-ink) text-center px-3 py-2 h-10.5 rounded-md outline-none focus:border-(--color-primary) focus:placeholder-transparent w-22.5 text-sm font-inherit transition-colors [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Enter custom number</p>
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            type="button"
                                            onClick={incrementCustomMinutes}
                                            disabled={isRunning}
                                            className="flex items-center justify-center h-10.5 w-10.5 rounded-md border border-(--color-hairline) bg-(--color-canvas) text-(--color-ink) hover:border-(--color-primary) hover:text-(--color-primary) transition-colors disabled:opacity-50 cursor-pointer shrink-0"
                                        >
                                            +
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Increment</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </div>
                    </div>

                    <div className="action-controls mb-8 flex justify-center">
                        <Select
                            value={config.defaultAction}
                            onValueChange={handleActionChange}
                            disabled={isRunning}
                        >
                            <SelectTrigger className="w-50 bg-(--color-canvas) border-(--color-hairline) text-(--color-ink) focus:ring-1 focus:ring-(--color-primary) outline-none hover:border-(--color-primary) h-10.5 transition-all duration-200 rounded-md text-sm pl-4 shadow-sm data-[state=open]:border-(--color-primary)">
                                <SelectValue placeholder="System Action" />
                            </SelectTrigger>
                            <SelectContent
                                position="popper"
                                style={{
                                    backgroundColor: '#242424',
                                    border: '1px solid #2a2a2a',
                                    color: '#ffffff',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
                                }}
                            >
                                {['Shutdown', 'Restart', 'Sleep', 'Hibernate', 'Lock'].map((action) => (
                                    <SelectItem
                                        key={action}
                                        value={action}
                                        className="py-3! px-3! my-1! text-white focus:bg-[#0a0a0a] focus:text-white focus:**:text-white hover:bg-[#0a0a0a] hover:text-white cursor-pointer rounded-md"
                                    >
                                        {action}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="main-buttons">
                        {!isRunning && (
                            <>
                                <StatefulButton
                                    onClick={startTimer}
                                    className="h-10.5 px-6 bg-(--color-primary) text-(--color-on-primary) hover:bg-(--color-primary-active) hover:ring-2 hover:ring-(--color-primary) ring-offset-(--color-surface-card)"
                                >
                                    Start Timer
                                </StatefulButton>
                                <button id="test-btn" className="flex items-center justify-center h-10.5 px-6 rounded-md bg-(--color-surface-card) border border-(--color-hairline) text-(--color-ink) font-medium transition-colors hover:bg-(--color-surface-elevated)" onClick={startTestMode}>Test Mode</button>
                            </>
                        )}
                        {isRunning && (
                            <button id="cancel-btn" className="danger-btn" onClick={cancelTimer}>Cancel</button>
                        )}
                    </div>

                    {statusMessage && (
                        <div id="status-message" className="status-message">{statusMessage}</div>
                    )}
                </section>

                <section className="card apps-section">
                    <h2>Target Applications</h2>
                    <p className="subtitle">These apps will be closed before the system action.</p>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3 mb-3" style={{ marginBottom: "12px" }}>
                        {config.targetApplications.map((app, index) => (
                            <div className="group flex items-center justify-between bg-(--color-canvas) hover:bg-(--color-surface-elevated) border border-(--color-hairline) hover:border-(--color-muted) px-3.5 py-3 rounded-md transition-all cursor-pointer" key={app.process} style={{ paddingBlock: "8px" }}>
                                <div className="flex items-center gap-3 py-1">
                                    <input
                                        type="checkbox"
                                        id={`app-${index}`}
                                        checked={app.enabled}
                                        onChange={(e) => handleAppToggle(index, e.target.checked)}
                                        disabled={isRunning}
                                        className="w-4 h-4 cursor-pointer accent-(--color-primary) ml-2"
                                        style={{ marginLeft: "12px" }}
                                    />
                                    <label htmlFor={`app-${index}`} className="w-full cursor-pointer select-none flex-1 text-sm font-medium text-(--color-ink)">
                                        {app.name} <span className="text-xs text-(--color-body) opacity-80 ml-1">({app.process})</span>
                                    </label>
                                </div>
                                <button
                                    onClick={() => handleDeleteApp(index)}
                                    disabled={isRunning}
                                    className="text-(--color-muted) hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer disabled:opacity-0"
                                    title="Delete App"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Add item */}
                    <div className="add-app-form mt-6 flex flex-col gap-3 w-full">
                        <div className='flex-1 flex flex-col gap-2.5'>
                            <input
                                type="text"
                                placeholder="New App Name"
                                value={newAppName}
                                onChange={(e) => setNewAppName(e.target.value)}
                                disabled={isRunning}
                                className="bg-(--color-canvas) hover:bg-(--color-surface-elevated) border border-(--color-hairline) hover:border-(--color-muted) text-(--color-ink) placeholder-(--color-muted) px-4 py-2 h-10.5 rounded-md outline-none focus:border-(--color-primary) w-full text-sm transition-all"
                                style={{ paddingLeft: "12px" }}
                            />
                            <input
                                type="text"
                                placeholder="Process (e.g. app.exe)"
                                value={newAppProcess}
                                onChange={(e) => setNewAppProcess(e.target.value)}
                                disabled={isRunning}
                                className="bg-(--color-canvas) hover:bg-(--color-surface-elevated) border border-(--color-hairline) hover:border-(--color-muted) text-(--color-ink) placeholder-(--color-muted) px-4 py-2 h-10.5 rounded-md outline-none focus:border-(--color-primary) w-full text-sm transition-all"
                                style={{ paddingLeft: "12px" }}
                            />
                        </div>
                        <button
                            onClick={(e) => {
                                if (isRunning || !newAppName.trim() || !newAppProcess.trim()) {
                                    e.preventDefault();
                                    return;
                                }
                                handleAddApp();
                            }}
                            className={`flex items-center justify-center h-10.5 flex-1 rounded-md bg-(--color-primary) text-(--color-on-primary) transition-all ${isRunning || !newAppName.trim() || !newAppProcess.trim() ? "opacity-50 cursor-not-allowed" : "hover:bg-(--color-primary-active) hover:scale-105 active:scale-95 cursor-pointer"}`}
                            title="Add Application"
                            aria-disabled={isRunning || !newAppName.trim() || !newAppProcess.trim()}
                        >
                            <Plus className="w-5 h-5 text-current" strokeWidth={2.5} />
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default App;
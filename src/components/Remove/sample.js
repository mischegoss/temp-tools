import React, { useState } from 'react'

const FlowchartInteractive = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [pingResult, setPingResult] = useState(null)

  const runAnimation = () => {
    setIsRunning(true)
    setCurrentStep(0)
    setPingResult(null)

    // First run - Success path
    const runSuccessPath = () => {
      setPingResult(true)
      const stepDurations = [1000, 2000, 1500, 1000, 2000, 1000]
      let totalDelay = 0

      stepDurations.forEach((duration, index) => {
        setTimeout(() => {
          setCurrentStep(index + 1)
        }, totalDelay)
        totalDelay += duration
      })

      // After success path, reset and run failure path
      setTimeout(() => {
        setCurrentStep(0)
        setTimeout(runFailurePath, 1500)
      }, totalDelay + 1000)
    }

    // Second run - Failure path
    const runFailurePath = () => {
      setPingResult(false)
      const stepDurations = [1000, 2000, 1500, 1000, 2000, 1000]
      let totalDelay = 0

      stepDurations.forEach((duration, index) => {
        setTimeout(() => {
          setCurrentStep(index + 1)
          if (index === stepDurations.length - 1) {
            setTimeout(() => setIsRunning(false), 1000)
          }
        }, totalDelay)
        totalDelay += duration
      })
    }

    // Start with success path
    runSuccessPath()
  }

  const resetAnimation = () => {
    setCurrentStep(0)
    setIsRunning(false)
    setPingResult(null)
  }

  const getStepMessage = () => {
    const pathType = pingResult === true ? 'SUCCESS' : 'FAILURE'
    const pathEmoji = pingResult === true ? '✅' : '❌'

    switch (currentStep) {
      case 1:
        return `🚀 Starting the workflow process... (${pathType} Path Demo)`
      case 2:
        return `📡 Sending ping to PingServer to check connectivity... (${pathType} Path Demo)`
      case 3:
        return `${pathEmoji} Ping ${
          pingResult ? 'successful!' : 'failed!'
        } Now evaluating the If-Else condition...`
      case 4:
        return pingResult
          ? '✅ Taking the SUCCESS branch - ping was successful!'
          : '❌ Taking the FAILURE branch - ping failed!'
      case 5:
        return pingResult
          ? '📧 Sending SUCCESS email notification...'
          : '📧 Sending FAILURE email notification...'
      case 6:
        return `🎯 ${pathType} path completed! Both paths converge here.`
      default:
        return ''
    }
  }

  // Inline styles
  const containerStyle = {
    width: '100%',
    height: '100vh',
    backgroundColor: '#f9fafb',
    position: 'relative',
    overflow: 'hidden',
    backgroundImage: 'radial-gradient(circle, #999 1px, transparent 1px)',
    backgroundSize: '20px 20px',
  }

  const controlPanelStyle = {
    position: 'absolute',
    top: '16px',
    left: '16px',
    background: 'white',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    zIndex: 10,
  }

  const buttonStyle = {
    backgroundColor: '#06b6d4',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    marginRight: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  }

  const buttonDisabledStyle = {
    ...buttonStyle,
    opacity: 0.5,
    cursor: 'not-allowed',
  }

  const resetButtonStyle = {
    backgroundColor: '#6b7280',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
  }

  const startNodeStyle = {
    position: 'absolute',
    top: '40px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#22d3ee',
    color: 'white',
    padding: '8px 32px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.5s',
    ...(currentStep === 1
      ? {
          boxShadow:
            '0 0 0 4px rgba(251, 191, 36, 0.75), 0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          transform: 'translateX(-50%) scale(1.1)',
        }
      : currentStep >= 1
      ? {
          boxShadow: '0 0 0 2px #0891b2',
        }
      : {}),
  }

  const lineStyle = {
    position: 'absolute',
    width: '2px',
    backgroundColor: currentStep >= 1 ? '#22d3ee' : '#9ca3af',
    top: '70px',
    left: '50%',
    transform: 'translateX(-50%)',
    height: '30px',
  }

  const nodeHeaderStyle = (isActive, isHighlighted) => ({
    backgroundColor: isHighlighted
      ? '#eab308'
      : isActive
      ? '#4b5563'
      : '#374151',
    color: 'white',
    padding: '8px 16px',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'all 0.5s',
    ...(isHighlighted
      ? {
          boxShadow:
            '0 0 0 4px rgba(251, 191, 36, 0.75), 0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }
      : isActive
      ? {
          boxShadow: '0 0 0 2px #22d3ee',
        }
      : {}),
  })

  const toggleSwitchStyle = isOn => ({
    width: '40px',
    height: '20px',
    borderRadius: '20px',
    backgroundColor: isOn ? '#22d3ee' : '#d1d5db',
    display: 'flex',
    alignItems: 'center',
    padding: '0 2px',
    cursor: 'pointer',
  })

  const toggleCircleStyle = isOn => ({
    width: '16px',
    height: '16px',
    backgroundColor: 'white',
    borderRadius: '50%',
    transform: isOn ? 'translateX(20px)' : 'translateX(0)',
    transition: 'transform 0.3s',
  })

  const widgetStyle = {
    position: 'absolute',
    top: '530px', // Just below the end circle
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 20,
  }

  const bannerFrameStyle = {
    background: 'linear-gradient(to right, #06b6d4, #2563eb)',
    padding: '2px',
    borderRadius: '8px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
  }

  const bannerContentStyle = {
    backgroundColor: 'white',
    borderRadius: '6px',
    padding: '12px 24px',
    minWidth: '600px',
    maxWidth: '800px',
  }

  const widgetFrameStyle = {
    background: 'linear-gradient(to right, #06b6d4, #2563eb)',
    padding: '4px',
    borderRadius: '12px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  }

  const widgetContentStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    minWidth: '384px',
  }

  const pulsingDotStyle = {
    width: '12px',
    height: '12px',
    backgroundColor: '#4ade80',
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
  }

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
      <div style={containerStyle}>
        {/* Control Panel - Always visible */}
        <div style={controlPanelStyle}>
          <button
            onClick={runAnimation}
            disabled={isRunning}
            style={isRunning ? buttonDisabledStyle : buttonStyle}
          >
            {isRunning ? 'Running Both Paths...' : 'Demo Both Paths'}
          </button>
          <button onClick={resetAnimation} style={resetButtonStyle}>
            Reset
          </button>
          <div style={{ marginTop: '8px', fontSize: '14px', color: '#4b5563' }}>
            Step: {currentStep} / 6{' '}
            {pingResult !== null &&
              `(${pingResult ? 'SUCCESS' : 'FAILURE'} Path)`}
          </div>
          {pingResult !== null && (
            <div
              style={{
                marginTop: '4px',
                fontSize: '14px',
                color: pingResult ? '#059669' : '#dc2626',
              }}
            >
              Demo: {pingResult ? 'Success' : 'Failure'} scenario
            </div>
          )}
        </div>

        {/* START */}
        <div style={startNodeStyle}>START</div>

        {/* Vertical line from START to Ping */}
        <div style={lineStyle} />

        {/* Ping Block */}
        <div
          style={{
            position: 'absolute',
            top: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              width: '256px',
            }}
          >
            {/* Header */}
            <div style={nodeHeaderStyle(currentStep >= 2, currentStep === 2)}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ fontSize: '14px' }}>⚙️</span>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>
                  Ping
                </span>
              </div>
              <button
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  width: '20px',
                  height: '20px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>
            {/* Body */}
            <div style={{ padding: '12px' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <div style={toggleSwitchStyle(true)}>
                  <div style={toggleCircleStyle(true)} />
                </div>
                <span style={{ fontSize: '14px', color: '#374151' }}>
                  PingServer
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Vertical line from Ping to If-Else */}
        <div
          style={{
            position: 'absolute',
            width: '2px',
            backgroundColor: currentStep >= 3 ? '#22d3ee' : '#9ca3af',
            top: '180px',
            left: '50%',
            transform: 'translateX(-50%)',
            height: '30px',
          }}
        />

        {/* If-Else Block */}
        <div
          style={{
            position: 'absolute',
            top: '210px',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <div style={nodeHeaderStyle(currentStep >= 3, currentStep === 3)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={toggleSwitchStyle(true)}>
                <div style={toggleCircleStyle(true)} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>
                If-Else - IfElse...
              </span>
            </div>
            <button
              style={{
                color: '#9ca3af',
                width: '20px',
                height: '20px',
                borderRadius: '4px',
                fontSize: '12px',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Decision split lines */}
        {/* Vertical down from If-Else */}
        <div
          style={{
            position: 'absolute',
            width: '2px',
            backgroundColor: currentStep >= 4 ? '#22d3ee' : '#9ca3af',
            top: '245px',
            left: '50%',
            transform: 'translateX(-50%)',
            height: '20px',
          }}
        />

        {/* Horizontal split line */}
        <div
          style={{
            position: 'absolute',
            height: '2px',
            backgroundColor: currentStep >= 4 ? '#22d3ee' : '#9ca3af',
            top: '265px',
            left: '25%',
            width: '50%',
          }}
        />

        {/* Left vertical down */}
        <div
          style={{
            position: 'absolute',
            width: '2px',
            backgroundColor:
              currentStep >= 4 && pingResult === true ? '#22d3ee' : '#9ca3af',
            top: '265px',
            left: '25%',
            height: '20px',
          }}
        />

        {/* Right vertical down */}
        <div
          style={{
            position: 'absolute',
            width: '2px',
            backgroundColor:
              currentStep >= 4 && pingResult === false ? '#22d3ee' : '#9ca3af',
            top: '265px',
            left: '75%',
            height: '20px',
          }}
        />

        {/* Left Branch Block - IfElseBranchA */}
        <div
          style={{
            position: 'absolute',
            top: '285px',
            left: '25%',
            transform: 'translateX(-50%)',
          }}
        >
          <div
            style={{
              ...nodeHeaderStyle(
                currentStep >= 4 && pingResult === true,
                currentStep === 4 && pingResult === true,
              ),
              padding: '8px 12px',
              borderRadius: '4px',
              ...(currentStep === 4 && pingResult === true
                ? { transform: 'scale(1.05)' }
                : {}),
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={toggleSwitchStyle(true)}>
                <div
                  style={{
                    ...toggleCircleStyle(true),
                    width: '12px',
                    height: '12px',
                  }}
                />
              </div>
              <span style={{ fontSize: '12px' }}>IfElseBranchA...</span>
            </div>
            <button
              style={{
                color: '#9ca3af',
                width: '16px',
                height: '16px',
                borderRadius: '4px',
                fontSize: '12px',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Right Branch Block - IfElseBranchA */}
        <div
          style={{
            position: 'absolute',
            top: '285px',
            left: '75%',
            transform: 'translateX(-50%)',
          }}
        >
          <div
            style={{
              ...nodeHeaderStyle(
                currentStep >= 4 && pingResult === false,
                currentStep === 4 && pingResult === false,
              ),
              padding: '8px 12px',
              borderRadius: '4px',
              ...(currentStep === 4 && pingResult === false
                ? { transform: 'scale(1.05)' }
                : {}),
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={toggleSwitchStyle(true)}>
                <div
                  style={{
                    ...toggleCircleStyle(true),
                    width: '12px',
                    height: '12px',
                  }}
                />
              </div>
              <span style={{ fontSize: '12px' }}>IfElseBranchA...</span>
            </div>
            <button
              style={{
                color: '#9ca3af',
                width: '16px',
                height: '16px',
                borderRadius: '4px',
                fontSize: '12px',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Vertical lines from branches to SendEmail */}
        <div
          style={{
            position: 'absolute',
            width: '2px',
            backgroundColor:
              currentStep >= 5 && pingResult === true ? '#22d3ee' : '#9ca3af',
            top: '315px',
            left: '25%',
            height: '25px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '2px',
            backgroundColor:
              currentStep >= 5 && pingResult === false ? '#22d3ee' : '#9ca3af',
            top: '315px',
            left: '75%',
            height: '25px',
          }}
        />

        {/* Left SendEmail Block - Success */}
        <div
          style={{
            position: 'absolute',
            top: '340px',
            left: '25%',
            transform: 'translateX(-50%)',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              width: '224px',
            }}
          >
            {/* Header */}
            <div
              style={nodeHeaderStyle(
                currentStep >= 5 && pingResult === true,
                currentStep === 5 && pingResult === true,
              )}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ fontSize: '14px' }}>📧</span>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>
                  SendEmail
                </span>
              </div>
              <button
                style={{
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  width: '20px',
                  height: '20px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>
            {/* Body */}
            <div style={{ padding: '12px' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <div style={toggleSwitchStyle(true)}>
                  <div style={toggleCircleStyle(true)} />
                </div>
                <span style={{ fontSize: '14px', color: '#374151' }}>
                  SuccessEmail
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right SendEmail Block - Failure */}
        <div
          style={{
            position: 'absolute',
            top: '340px',
            left: '75%',
            transform: 'translateX(-50%)',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              width: '224px',
            }}
          >
            {/* Header */}
            <div
              style={nodeHeaderStyle(
                currentStep >= 5 && pingResult === false,
                currentStep === 5 && pingResult === false,
              )}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ fontSize: '14px' }}>📧</span>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>
                  SendEmail
                </span>
              </div>
              <button
                style={{
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  width: '20px',
                  height: '20px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>
            {/* Body */}
            <div style={{ padding: '12px' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <div style={toggleSwitchStyle(true)}>
                  <div style={toggleCircleStyle(true)} />
                </div>
                <span style={{ fontSize: '14px', color: '#374151' }}>
                  FailureEmail
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Convergence lines from SendEmail blocks */}
        <div
          style={{
            position: 'absolute',
            width: '2px',
            backgroundColor: currentStep >= 6 ? '#22d3ee' : '#9ca3af',
            top: '420px',
            left: '25%',
            height: '20px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '2px',
            backgroundColor: currentStep >= 6 ? '#22d3ee' : '#9ca3af',
            top: '420px',
            left: '75%',
            height: '20px',
          }}
        />

        {/* Convergence horizontal line */}
        <div
          style={{
            position: 'absolute',
            height: '2px',
            backgroundColor: currentStep >= 6 ? '#22d3ee' : '#9ca3af',
            top: '440px',
            left: '25%',
            width: '50%',
          }}
        />

        {/* Final vertical line to end */}
        <div
          style={{
            position: 'absolute',
            width: '2px',
            backgroundColor: currentStep >= 6 ? '#22d3ee' : '#9ca3af',
            top: '440px',
            left: '50%',
            transform: 'translateX(-50%)',
            height: '20px',
          }}
        />

        {/* Status Banner - Below the end circle */}
        {isRunning && currentStep > 0 && (
          <div style={widgetStyle}>
            <div style={bannerFrameStyle}>
              <div style={bannerContentStyle}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  {/* Left side - Status indicator */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <div style={pulsingDotStyle}></div>
                    <div>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: '#1f2937',
                          marginBottom: '2px',
                        }}
                      >
                        Step {currentStep} of 6
                        {pingResult !== null && (
                          <span
                            style={{
                              fontSize: '12px',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontWeight: '500',
                              backgroundColor: pingResult
                                ? '#dcfce7'
                                : '#fef2f2',
                              color: pingResult ? '#166534' : '#991b1b',
                              marginLeft: '8px',
                            }}
                          >
                            {pingResult ? 'SUCCESS' : 'FAILURE'}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        WORKFLOW STATUS
                      </div>
                    </div>
                  </div>

                  {/* Center - Message */}
                  <div
                    style={{ flex: 1, textAlign: 'center', margin: '0 20px' }}
                  >
                    <div
                      style={{
                        color: '#374151',
                        fontSize: '14px',
                        fontWeight: '500',
                      }}
                    >
                      {getStepMessage()}
                    </div>
                  </div>

                  {/* Right side - Result */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    {pingResult !== null && currentStep >= 3 && (
                      <>
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>
                          Result:
                        </span>
                        <div
                          style={{
                            fontSize: '13px',
                            padding: '4px 12px',
                            borderRadius: '16px',
                            fontWeight: '500',
                            backgroundColor: pingResult ? '#f0fdf4' : '#fef2f2',
                            color: pingResult ? '#166534' : '#991b1b',
                            border: pingResult
                              ? '1px solid #bbf7d0'
                              : '1px solid #fecaca',
                          }}
                        >
                          {pingResult ? 'SUCCESS' : 'FAILURE'}
                        </div>
                      </>
                    )}
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        backgroundColor: '#f3f4f6',
                        padding: '4px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      Live Demo
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Between-runs Banner */}
        {isRunning && currentStep === 0 && pingResult === true && (
          <div style={widgetStyle}>
            <div
              style={{
                ...bannerFrameStyle,
                background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
              }}
            >
              <div style={bannerContentStyle}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px',
                  }}
                >
                  <div
                    style={{ ...pulsingDotStyle, backgroundColor: '#60a5fa' }}
                  ></div>
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#1e40af',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                      }}
                    >
                      <span>🔄</span>
                      <span>Switching to FAILURE Path</span>
                    </div>
                    <div
                      style={{
                        color: '#2563eb',
                        fontSize: '13px',
                        marginTop: '2px',
                      }}
                    >
                      Now demonstrating what happens when the ping fails...
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      backgroundColor: '#f3f4f6',
                      padding: '4px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    Demo Mode
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* End Circle */}
        <div
          style={{
            position: 'absolute',
            top: '460px',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#22d3ee',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              transition: 'all 0.5s',
              ...(currentStep === 6
                ? {
                    boxShadow:
                      '0 0 0 4px rgba(251, 191, 36, 0.75), 0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    transform: 'translateX(-50%) scale(1.1)',
                  }
                : currentStep >= 6
                ? {
                    boxShadow: '0 0 0 2px #0891b2',
                  }
                : {}),
            }}
          >
            <svg width='20' height='20' viewBox='0 0 24 24' fill='currentColor'>
              <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
            </svg>
          </div>
        </div>
      </div>
    </>
  )
}

export default FlowchartInteractive

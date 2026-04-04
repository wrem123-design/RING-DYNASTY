(function () {
  if (window.__RING_DYNASTY_CANVAS_EFFECTS__) {
    return;
  }
  window.__RING_DYNASTY_CANVAS_EFFECTS__ = true;

  const CANVAS_WIDTH = 640;
  const CANVAS_HEIGHT = 560;
  const SCENE_HEIGHT = 420;
  const COMMENTARY_Y = 420;
  const COMMENTARY_HEIGHT = 140;
  const MAIN_BATTLE_BACKGROUND_PATH = "data/images/SHOW LOGISTICS/RING.png";

  const SCENE_FLOOR_Y = 342;
  const FIGHTER_DRAW_WIDTH = 160;
  const FIGHTER_DRAW_HEIGHT = 240;
  const CUSTOM_STAND_GROUND_OFFSET = 18;
  const CUSTOM_STAND_DOWN_OFFSET = 8;
  const LEFT_FIGHTER_BASE_X = 220;
  const RIGHT_FIGHTER_BASE_X = CANVAS_WIDTH - 220;
  const COMMENTARY_TEXT_LEFT = 54;
  const COMMENTARY_TEXT_WIDTH = CANVAS_WIDTH - 110;
  const BATTLE_TEMPO_MULTIPLIER = 2;
  const COMMENTARY_TEMPO_MULTIPLIER = 2;
  const INTRO_DURATION = Math.round(1150 * BATTLE_TEMPO_MULTIPLIER);
  const OUTRO_DURATION = Math.round(3600 * BATTLE_TEMPO_MULTIPLIER);

  const commentaryBG = {
    normal: "#0a0a0f",
    power: "#1a0800",
    critical: "#1a1400",
    finisher: "#000000",
    down: "#0f0010",
    danger: "#160406",
    victory: "#201707"
  };

  const commentaryTexts = {
    basic_attack: [
      { l1: "[A]가 [B]에게 달려든다!", l2: "펀치 명중! [DMG] 데미지!" },
      { l1: "[A]의 오른손이 뻗어나간다", l2: "[DMG]의 타격! [B]가 뒤로 밀린다" },
      { l1: "[A]가 빠르게 치고 들어간다", l2: "명중! [B]의 체력이 깎인다" }
    ],
    power_attack: [
      { l1: "[A]가 전력을 다해 도약한다!", l2: "강력한 슬램!! [DMG] 대미지!!" },
      { l1: "[A]의 결정적인 한 방이 날아간다!", l2: "[B]가 크게 흔들린다!! [DMG]!!" },
      { l1: "[A]가 링을 박차고 돌진한다!", l2: "파워 무브 성공!! [DMG]!!" }
    ],
    technical: [
      { l1: "[A]가 [B]의 빈틈을 노린다", l2: "기술 연결 성공! [DMG] 데미지" },
      { l1: "[A]의 정교한 그래플링!", l2: "기술적인 한 수! [DMG]" },
      { l1: "[A]가 [B]를 제압한다", l2: "테크니컬 무브! [DMG] 데미지" }
    ],
    critical: [
      { l1: "[A]가 정확히 급소를 노렸다!!", l2: "치명타!! [DMG]!! 관중이 술렁인다!!" },
      { l1: "완벽한 타이밍의 한 방!!", l2: "CRITICAL HIT!! [DMG]!!" },
      { l1: "[A]의 본능적인 일격!!", l2: "급소 공격!! [DMG]!! 경기가 달아오른다!!" }
    ],
    finisher: [
      { l1: "[A]가 [FINISHER]를 준비한다!!!", l2: "전설의 필살기!!! 링이 들썩인다!!!" },
      { l1: "이것이 [A]의 마지막 카드!!!", l2: "[FINISHER]!!! 관중이 폭발한다!!!" }
    ],
    finisher_miss: [
      { l1: "[A]가 피니셔를 시도한다!", l2: "[B]가 카운터로 받아쳤다! [A]가 흔들린다!" },
      { l1: "[A]의 필살기 시도!", l2: "카운터!! [B]가 기회를 잡았다!" }
    ],
    down: [
      { l1: "[B]가 쓰러진다!", l2: "다운!! 심판이 카운트를 세기 시작한다!" },
      { l1: "[B]가 링 바닥에 쓰러졌다!", l2: "다운! [A]가 기회를 노린다!" }
    ],
    pin_attempt: [
      { l1: "[A]가 [B]를 덮친다!", l2: "핀폴 시도! 하나...!" },
      { l1: "[A]가 핀폴을 노린다!", l2: "심판의 손이 내려간다! 하나...!" }
    ],
    pin_kickout_1: [
      { l1: "하나!", l2: "[B]가 어깨를 들어올린다! 탈출!" },
      { l1: "하나!", l2: "[B]가 1카운트에 탈출했다!" }
    ],
    pin_kickout_2: [
      { l1: "둘!!!", l2: "[B]가 극적으로 탈출!! 2카운트 탈출!!" },
      { l1: "둘!!!", l2: "이럴 수가!! [B]가 2에 버텼다!!!" }
    ],
    pin_success: [
      { l1: "하나!! 둘!! 셋!!!", l2: "[A] 승리!!! 경기 종료!!!" },
      { l1: "하나... 둘... 셋!!!", l2: "게임 오버!!! [A]가 이겼다!!!" }
    ],
    dodge: [
      { l1: "[B]가 순간적으로 몸을 피한다!", l2: "회피 성공! [A]의 공격이 빗나갔다!" }
    ],
    block: [
      { l1: "[B]가 공격을 막아냈다!", l2: "블로킹! 데미지를 최소화했다" }
    ],
    danger: [
      { l1: "[B]의 체력이 한계에 다다랐다...", l2: "이 경기, 이제 한 방에 갈릴 수 있다..." },
      { l1: "[B]가 위태롭다...", l2: "더 버틸 수 있을까... 관중이 숨을 죽인다" }
    ],
    phase_mid: [
      { l1: "경기가 점점 달아오르고 있다!", l2: "두 선수 모두 물러서지 않는다!" }
    ],
    phase_climax: [
      { l1: "이제 마지막 승부다!!!", l2: "관중이 완전히 폭발했다!!!" }
    ]
  };

  const commentary = {
    line1: { text: "", color: "#ecf0f1" },
    line2: { text: "", color: "#e74c3c" },
    bgColor: commentaryBG.normal,
    bgTargetColor: commentaryBG.normal,
    currentTurn: 0,
    maxTurns: 60,
    currentPhase: "OPENING",
    lastDangerKey: ""
  };

  class TypewriterText {
    constructor() {
      this.fullText = "";
      this.displayText = "";
      this.color = "#ecf0f1";
      this.typingSpeed = 40;
      this.elapsed = 0;
      this.delay = 0;
      this.instant = true;
    }

    type(text, speed = 40, color = "#ecf0f1", options = {}) {
      this.fullText = String(text || "");
      this.displayText = "";
      this.color = color;
      this.typingSpeed = Math.max(1, Number(speed) || 40);
      this.elapsed = 0;
      this.delay = Math.max(0, Number(options.delay) || 0);
      this.instant = Boolean(options.instant);
      if (this.instant) {
        this.displayText = this.fullText;
      }
    }

    set(text, color = "#ecf0f1") {
      this.fullText = String(text || "");
      this.displayText = this.fullText;
      this.color = color;
      this.elapsed = 0;
      this.delay = 0;
      this.instant = true;
    }

    clear() {
      this.set("", this.color);
    }

    update(delta) {
      if (this.instant) {
        this.displayText = this.fullText;
        return;
      }
      if (this.delay > 0) {
        this.delay = Math.max(0, this.delay - delta);
        return;
      }
      this.elapsed += delta;
      const visibleCount = Math.max(0, Math.min(this.fullText.length, Math.floor(this.elapsed / this.typingSpeed)));
      this.displayText = this.fullText.slice(0, visibleCount);
    }

    complete() {
      this.displayText = this.fullText;
      this.instant = true;
      this.delay = 0;
    }
  }

  const line1Writer = new TypewriterText();
  const line2Writer = new TypewriterText();
  let centerTextDisplay = null;

  function lerpValue(start, end, t) {
    return start + ((end - start) * t);
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - clamp(t, 0, 1), 3);
  }

  function easeInCubic(t) {
    return Math.pow(clamp(t, 0, 1), 3);
  }

  function easeInOutCubic(t) {
    const value = clamp(t, 0, 1);
    return value < 0.5
      ? 4 * value * value * value
      : 1 - Math.pow(-2 * value + 2, 3) / 2;
  }

  function applyCommentaryState(line1, line2, bgKey, line1Color = "#ecf0f1", line2Color = "#e74c3c", options = {}) {
    const nextLine1 = String(line1 || "");
    const nextLine2 = String(line2 || "");
    commentary.line1.text = nextLine1;
    commentary.line2.text = nextLine2;
    commentary.line1.color = line1Color;
    commentary.line2.color = line2Color;
    commentary.bgTargetColor = commentaryBG[bgKey] || commentaryBG.normal;
    if (options.instant) {
      line1Writer.set(nextLine1, line1Color);
      line2Writer.set(nextLine2, line2Color);
      return;
    }
    if (!options.skipLine1) {
      line1Writer.type(
        nextLine1,
        Math.round((Number.isFinite(options.line1Speed) ? options.line1Speed : 25) * COMMENTARY_TEMPO_MULTIPLIER),
        line1Color,
        { delay: options.line1Delay || 0 }
      );
    }
    if (!options.skipLine2) {
      line2Writer.type(
        nextLine2,
        Math.round((Number.isFinite(options.line2Speed) ? options.line2Speed : 50) * COMMENTARY_TEMPO_MULTIPLIER),
        line2Color,
        { delay: options.line2Delay || 0 }
      );
    }
  }

  let battleAudioContext = null;

  function ensureBattleAudioContext() {
    if (battleAudioContext) {
      return battleAudioContext;
    }
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextCtor) {
      return null;
    }
    try {
      battleAudioContext = new AudioContextCtor();
    } catch (error) {
      battleAudioContext = null;
    }
    return battleAudioContext;
  }

  function resumeBattleAudioContext() {
    const audioContext = ensureBattleAudioContext();
    if (audioContext && audioContext.state === "suspended") {
      audioContext.resume().catch(() => {});
    }
  }

  function playHitSound(type) {
    const audioContext = ensureBattleAudioContext();
    if (!audioContext || audioContext.state !== "running") {
      return;
    }
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    switch (type) {
      case "power":
        oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(40, audioContext.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.55, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.28);
        break;
      case "finisher":
        oscillator.frequency.setValueAtTime(60, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(20, audioContext.currentTime + 0.5);
        gainNode.gain.setValueAtTime(0.85, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
        break;
      case "critical":
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.15);
        gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.18);
        break;
      case "technical":
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(110, audioContext.currentTime + 0.14);
        gainNode.gain.setValueAtTime(0.34, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.16);
        break;
      default:
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.28, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.14);
        break;
    }
    oscillator.type = "sawtooth";
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.65);
  }

  function drawStarParticle(ctx, particle) {
    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(particle.x, particle.y);
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    for (let index = 0; index < 5; index += 1) {
      const outer = particle.size;
      const inner = particle.size * 0.4;
      const outerAngle = ((Math.PI * 2) / 5) * index - (Math.PI / 2);
      const innerAngle = outerAngle + (Math.PI / 5);
      const outerX = Math.cos(outerAngle) * outer;
      const outerY = Math.sin(outerAngle) * outer;
      const innerX = Math.cos(innerAngle) * inner;
      const innerY = Math.sin(innerAngle) * inner;
      if (index === 0) {
        ctx.moveTo(outerX, outerY);
      } else {
        ctx.lineTo(outerX, outerY);
      }
      ctx.lineTo(innerX, innerY);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawSparkParticle(ctx, particle) {
    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.strokeStyle = particle.color;
    ctx.lineWidth = particle.size;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(particle.x, particle.y);
    ctx.lineTo(
      particle.x - (Math.cos(particle.angle) * particle.length),
      particle.y - (Math.sin(particle.angle) * particle.length)
    );
    ctx.stroke();
    ctx.restore();
  }

  function drawFlameParticle(ctx, particle) {
    ctx.save();
    ctx.globalAlpha = particle.opacity * 0.82;
    const gradient = ctx.createRadialGradient(
      particle.x,
      particle.y,
      0,
      particle.x,
      particle.y,
      particle.size
    );
    gradient.addColorStop(0, "#ffff9f");
    gradient.addColorStop(0.35, "#ff9500");
    gradient.addColorStop(0.75, particle.color || "#ff6b00");
    gradient.addColorStop(1, "rgba(255, 80, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(particle.x, particle.y, particle.size * 0.45, particle.size, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawAuraParticle(ctx, particle) {
    ctx.save();
    ctx.globalAlpha = particle.opacity * 0.65;
    const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size);
    gradient.addColorStop(0, particle.color || "#f1c40f");
    gradient.addColorStop(1, "rgba(241, 196, 15, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function lerpColor(fromColor, toColor, amount) {
    const fromHex = parseInt(fromColor.slice(1), 16);
    const toHex = parseInt(toColor.slice(1), 16);
    const fromR = fromHex >> 16;
    const fromG = (fromHex >> 8) & 0xff;
    const fromB = fromHex & 0xff;
    const toR = toHex >> 16;
    const toG = (toHex >> 8) & 0xff;
    const toB = toHex & 0xff;
    const red = Math.round(fromR + ((toR - fromR) * amount));
    const green = Math.round(fromG + ((toG - fromG) * amount));
    const blue = Math.round(fromB + ((toB - fromB) * amount));
    return `#${((red << 16) | (green << 8) | blue).toString(16).padStart(6, "0")}`;
  }

  function pickCommentaryLine(poolKey) {
    const pool = commentaryTexts[poolKey] || commentaryTexts.basic_attack;
    return pool[Math.floor(Math.random() * pool.length)] || pool[0];
  }

  function formatCommentaryLine(template, replacements) {
    return String(template || "").replace(/\[(A|B|DMG|FINISHER)\]/g, (match, key) => replacements[key] ?? match);
  }

  function setCommentary(poolKey, replacements, bgKey, line1Color = "#ecf0f1", line2Color = "#e74c3c") {
    const selected = pickCommentaryLine(poolKey);
    commentary.line1.text = formatCommentaryLine(selected.l1, replacements);
    commentary.line2.text = formatCommentaryLine(selected.l2, replacements);
    commentary.line1.color = line1Color;
    commentary.line2.color = line2Color;
    commentary.bgTargetColor = commentaryBG[bgKey] || commentaryBG.normal;
  }

  function getCommentaryPhase(turn, maxTurns) {
    const ratio = maxTurns > 0 ? turn / maxTurns : 0;
    if (ratio >= 0.75) {
      return "CLIMAX";
    }
    if (ratio >= 0.4) {
      return "MID MATCH";
    }
    return "OPENING";
  }

  function renderCommentary(ctx) {
    commentary.bgColor = lerpColor(commentary.bgColor, commentary.bgTargetColor, 0.08);
    const fitText = (text, maxWidth) => {
      let value = String(text || "");
      if (ctx.measureText(value).width <= maxWidth) {
        return value;
      }
      while (value.length > 1 && ctx.measureText(`${value}…`).width > maxWidth) {
        value = value.slice(0, -1);
      }
      return `${value}…`;
    };
    ctx.save();
    ctx.fillStyle = commentary.bgColor;
    ctx.fillRect(0, COMMENTARY_Y, CANVAS_WIDTH, COMMENTARY_HEIGHT);
    ctx.strokeStyle = "#e74c3c";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, COMMENTARY_Y);
    ctx.lineTo(CANVAS_WIDTH, COMMENTARY_Y);
    ctx.stroke();

    ctx.fillStyle = "#161922";
    ctx.beginPath();
    ctx.arc(26, COMMENTARY_Y + 35, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#e74c3c";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(26, COMMENTARY_Y + 35, 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#ecf0f1";
    ctx.fillRect(22.5, COMMENTARY_Y + 30, 7, 9);
    ctx.fillRect(24, COMMENTARY_Y + 38, 4, 8);
    ctx.beginPath();
    ctx.arc(26, COMMENTARY_Y + 28, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '12px "Courier New"';
    ctx.fillStyle = line1Writer.color;
    ctx.textAlign = "left";
    ctx.fillText(fitText(line1Writer.displayText, COMMENTARY_TEXT_WIDTH), COMMENTARY_TEXT_LEFT, COMMENTARY_Y + 35);

    ctx.font = 'bold 20px "Courier New"';
    ctx.fillStyle = line2Writer.color;
    ctx.fillText(fitText(line2Writer.displayText, COMMENTARY_TEXT_WIDTH), COMMENTARY_TEXT_LEFT, COMMENTARY_Y + 82);

    ctx.font = '11px "Courier New"';
    ctx.fillStyle = "#7f8c8d";
    ctx.textAlign = "right";
    ctx.fillText(`TURN ${commentary.currentTurn} / ${commentary.maxTurns}`, 620, COMMENTARY_Y + 120);
    ctx.fillText(commentary.currentPhase, 620, COMMENTARY_Y + 102);
    ctx.restore();
  }

  function createCanvasEffectEngine() {
    return {
      particles: [],
      impacts: [],
      flashes: [],
      overlays: [],
      floatingTexts: [],
      orbitStars: [],
      timers: [],
      effectLockRemaining: 0,
      shakes: { x: 0, y: 0, intensity: 0, duration: 0, elapsed: 0 },
      dangerPulse: {
        active: false,
        opacity: 0,
        growing: true,
        side: "left"
      },
      reset() {
        this.particles = [];
        this.impacts = [];
        this.flashes = [];
        this.overlays = [];
        this.floatingTexts = [];
        this.orbitStars = [];
        this.timers = [];
        this.effectLockRemaining = 0;
        this.shakes = { x: 0, y: 0, intensity: 0, duration: 0, elapsed: 0 };
        this.dangerPulse = { active: false, opacity: 0, growing: true, side: "left" };
      },
      lock(duration) {
        this.effectLockRemaining = Math.max(this.effectLockRemaining, duration || 0);
      },
      canTrigger(force = false) {
        return force || this.effectLockRemaining <= 0;
      },
      scheduleAction(delay, callback) {
        this.timers.push({
          delay: Math.max(0, delay || 0),
          callback
        });
      },
      update(delta) {
        const safeDelta = Math.min(Math.max(delta || 16, 0), 48);
        const step = safeDelta / 16;
        this.effectLockRemaining = Math.max(0, this.effectLockRemaining - safeDelta);
        this.updateTimers(safeDelta);
        this.updateParticles(step);
        this.updateImpacts(step);
        this.updateFlashes(safeDelta);
        this.updateShake(safeDelta);
        this.updateOverlays(safeDelta);
        this.updateOrbitStars(step);
        this.updateFloatingTexts(step);
        this.updateDangerPulse(step);
      },
      updateTimers(delta) {
        for (let index = this.timers.length - 1; index >= 0; index -= 1) {
          const timer = this.timers[index];
          timer.delay -= delta;
          if (timer.delay <= 0) {
            this.timers.splice(index, 1);
            if (typeof timer.callback === "function") {
              timer.callback();
            }
          }
        }
      },
      updateParticles(step) {
        for (let index = this.particles.length - 1; index >= 0; index -= 1) {
          const particle = this.particles[index];
          particle.x += particle.vx * step;
          particle.y += particle.vy * step;
          particle.vy += particle.gravity * step;
          particle.vx *= Math.pow(0.97, step);
          particle.opacity -= particle.decay * step;
          particle.life -= step;
          if (particle.life <= 0 || particle.opacity <= 0) {
            this.particles.splice(index, 1);
          }
        }
      },
      updateImpacts(step) {
        for (let index = this.impacts.length - 1; index >= 0; index -= 1) {
          const impact = this.impacts[index];
          impact.radius += (impact.maxRadius - impact.radius) * impact.speed * step;
          impact.opacity -= 0.06 * step;
          if (impact.opacity <= 0) {
            this.impacts.splice(index, 1);
          }
        }
      },
      updateFlashes(delta) {
        for (let index = this.flashes.length - 1; index >= 0; index -= 1) {
          const flash = this.flashes[index];
          flash.remaining -= delta;
          flash.opacity = flash.maxOpacity * clamp(flash.remaining / flash.duration, 0, 1);
          if (flash.remaining <= 0 || flash.opacity <= 0) {
            this.flashes.splice(index, 1);
          }
        }
      },
      updateShake(delta) {
        if (this.shakes.elapsed < this.shakes.duration) {
          this.shakes.elapsed += delta;
          const progress = clamp(this.shakes.elapsed / this.shakes.duration, 0, 1);
          const power = this.shakes.intensity * (1 - progress);
          this.shakes.x = (Math.random() - 0.5) * power;
          this.shakes.y = (Math.random() - 0.5) * power;
        } else {
          this.shakes.x = 0;
          this.shakes.y = 0;
        }
      },
      updateOverlays(delta) {
        for (let index = this.overlays.length - 1; index >= 0; index -= 1) {
          const overlay = this.overlays[index];
          overlay.remaining -= delta;
          if (overlay.remaining <= 0) {
            this.overlays.splice(index, 1);
          }
        }
      },
      updateOrbitStars(step) {
        for (let index = this.orbitStars.length - 1; index >= 0; index -= 1) {
          const orbit = this.orbitStars[index];
          orbit.angle += orbit.speed * step;
          orbit.life -= step;
          if (orbit.life < 20) {
            orbit.opacity = Math.max(0, orbit.opacity - (0.05 * step));
          }
          if (orbit.life <= 0 || orbit.opacity <= 0) {
            this.orbitStars.splice(index, 1);
          }
        }
      },
      updateFloatingTexts(step) {
        for (let index = this.floatingTexts.length - 1; index >= 0; index -= 1) {
          const floatingText = this.floatingTexts[index];
          floatingText.x += floatingText.vx * step;
          floatingText.y += floatingText.vy * step;
          floatingText.vy *= Math.pow(floatingText.friction, step);
          floatingText.life -= step;
          if (floatingText.life < 25) {
            floatingText.opacity -= 0.04 * step;
          }
          if (floatingText.life <= 0 || floatingText.opacity <= 0) {
            this.floatingTexts.splice(index, 1);
          }
        }
      },
      updateDangerPulse(step) {
        if (!this.dangerPulse.active) {
          this.dangerPulse.opacity = Math.max(0, this.dangerPulse.opacity - (0.04 * step));
          return;
        }
        if (this.dangerPulse.growing) {
          this.dangerPulse.opacity += 0.02 * step;
          if (this.dangerPulse.opacity >= 0.35) {
            this.dangerPulse.opacity = 0.35;
            this.dangerPulse.growing = false;
          }
        } else {
          this.dangerPulse.opacity -= 0.02 * step;
          if (this.dangerPulse.opacity <= 0.06) {
            this.dangerPulse.opacity = 0.06;
            this.dangerPulse.growing = true;
          }
        }
      },
      addImpactRing(x, y, color, maxRadius, lineWidth) {
        this.impacts.push({
          x,
          y,
          color,
          radius: 5,
          maxRadius,
          lineWidth,
          opacity: 0.9,
          speed: 0.35
        });
      },
      addScreenFlash(color, maxOpacity, duration) {
        this.flashes.push({
          color,
          maxOpacity,
          opacity: maxOpacity,
          duration,
          remaining: duration
        });
      },
      addScreenOverlay(color, opacity, duration) {
        this.overlays.push({
          color,
          opacity,
          duration,
          remaining: duration
        });
      },
      triggerShake(intensity, duration) {
        this.shakes = {
          x: 0,
          y: 0,
          intensity,
          duration,
          elapsed: 0
        };
      },
      addFloatingText(x, y, text, color, size, bold = false) {
        this.floatingTexts.push({
          x,
          y,
          text,
          color,
          size,
          bold,
          opacity: 1,
          vy: -2.5,
          vx: (Math.random() - 0.5) * 0.5,
          life: 70,
          friction: 0.92
        });
      },
      addBasicHit(x, y) {
        if (!this.canTrigger()) {
          return;
        }
        for (let index = 0; index < 8; index += 1) {
          const angle = ((Math.PI * 2) / 8) * index;
          const speed = 3 + (Math.random() * 2);
          this.particles.push({
            type: "star",
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 4 + (Math.random() * 3),
            color: "#ffffff",
            opacity: 1,
            decay: 0.06,
            gravity: 0.1,
            life: 20
          });
        }
        this.addImpactRing(x, y, "#ffffff", 25, 3);
      },
      addPowerHit(x, y) {
        if (!this.canTrigger()) {
          return;
        }
        const colors = ["#ff6b00", "#ff9500", "#ff3300", "#ffcc00"];
        for (let index = 0; index < 15; index += 1) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 4 + (Math.random() * 5);
          this.particles.push({
            type: "circle",
            x: x + ((Math.random() - 0.5) * 10),
            y: y + ((Math.random() - 0.5) * 10),
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1,
            size: 5 + (Math.random() * 6),
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: 1,
            decay: 0.04,
            gravity: 0.15,
            life: 30
          });
        }
        for (let index = 0; index < 6; index += 1) {
          this.particles.push({
            type: "flame",
            x: x + ((Math.random() - 0.5) * 20),
            y,
            vx: (Math.random() - 0.5) * 2,
            vy: -(4 + (Math.random() * 4)),
            size: 8 + (Math.random() * 8),
            color: "#ff6b00",
            opacity: 0.9,
            decay: 0.05,
            gravity: -0.05,
            life: 25
          });
        }
        this.addImpactRing(x, y, "#ff6b00", 50, 4);
        this.scheduleAction(80, () => this.addImpactRing(x, y, "#ff3300", 70, 3));
        this.triggerShake(6, 200);
      },
      addCriticalHit(x, y) {
        if (!this.canTrigger()) {
          return;
        }
        for (let index = 0; index < 20; index += 1) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 6 + (Math.random() * 6);
          this.particles.push({
            type: "spark",
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 2 + (Math.random() * 2),
            length: 8 + (Math.random() * 10),
            angle,
            color: "#f1c40f",
            opacity: 1,
            decay: 0.05,
            gravity: 0.08,
            life: 25
          });
        }
        this.addFloatingText(x, y - 20, "CRITICAL!", "#f1c40f", 28, true);
        this.addImpactRing(x, y, "#f1c40f", 60, 5);
        this.addImpactRing(x, y, "#ffffff", 40, 3);
        this.addScreenFlash("#f1c40f", 0.3, 150);
        this.triggerShake(8, 250);
      },
      addFinisher(x, y, finisherName, canvasWidth, canvasHeight) {
        this.addScreenOverlay("#000000", 0.85, 200);
        this.lock(3000);
        this.scheduleAction(200, () => {
          const colors = ["#e74c3c", "#c0392b", "#f39c12", "#f1c40f"];
          for (let index = 0; index < 30; index += 1) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 5 + (Math.random() * 8);
            this.particles.push({
              type: "circle",
              x: x + ((Math.random() - 0.5) * 20),
              y: y + ((Math.random() - 0.5) * 20),
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              size: 6 + (Math.random() * 10),
              color: colors[Math.floor(Math.random() * colors.length)],
              opacity: 1,
              decay: 0.025,
              gravity: 0.1,
              life: 50
            });
          }
          this.addImpactRing(x, y, "#f1c40f", 40, 6);
          this.addImpactRing(x, y, "#e74c3c", 80, 5);
          this.addImpactRing(x, y, "#f1c40f", 120, 4);
          this.addScreenFlash("#e74c3c", 0.6, 300);
          this.triggerShake(15, 400);
        });
        this.scheduleAction(500, () => {
          this.addFloatingText((canvasWidth || 640) / 2, (canvasHeight || 360) / 2, `${finisherName}!!!`, "#f1c40f", 40, true);
          for (let index = 0; index < 20; index += 1) {
            this.particles.push({
              type: "star",
              x: Math.random() * (canvasWidth || 640),
              y: -10,
              vx: (Math.random() - 0.5) * 2,
              vy: 3 + (Math.random() * 3),
              size: 3 + (Math.random() * 4),
              color: "#f1c40f",
              opacity: 0.9,
              decay: 0.015,
              gravity: 0.05,
              life: 80
            });
          }
        });
      },
      addDown(x, y) {
        if (!this.canTrigger()) {
          return;
        }
        for (let index = 0; index < 12; index += 1) {
          this.particles.push({
            type: "dust",
            x: x + ((Math.random() - 0.5) * 40),
            y,
            vx: (Math.random() - 0.5) * 4,
            vy: -(1 + (Math.random() * 2)),
            size: 8 + (Math.random() * 12),
            color: "#8b7355",
            opacity: 0.7,
            decay: 0.025,
            gravity: -0.02,
            life: 40
          });
        }
        this.addFloatingText(x, y - 80, "DOWN!", "#e74c3c", 32, true);
        this.triggerShake(10, 300);
        this.addOrbitStars(x, y - 60, 3);
      },
      addOrbitStars(cx, cy, count) {
        this.orbitStars.push({
          cx,
          cy,
          count,
          radius: 25,
          speed: 0.15,
          angle: 0,
          opacity: 1,
          life: 90
        });
      },
      addFinisherAura(x, y) {
        for (let index = 0; index < 3; index += 1) {
          this.particles.push({
            type: "aura",
            x: x + ((Math.random() - 0.5) * 50),
            y,
            vx: (Math.random() - 0.5) * 0.5,
            vy: -(1 + (Math.random() * 2)),
            size: 4 + (Math.random() * 4),
            color: "#f1c40f",
            opacity: 0.8,
            decay: 0.03,
            gravity: 0,
            life: 30
          });
        }
      },
      setDangerPulse(active, side) {
        this.dangerPulse.active = active;
        if (side) {
          this.dangerPulse.side = side;
        }
      },
      addVictoryBurst(canvasWidth, canvasHeight) {
        this.addScreenFlash("#f1c40f", 0.5, 500);
        for (let index = 0; index < 20; index += 1) {
          this.particles.push({
            type: "star",
            x: Math.random() * canvasWidth,
            y: -10 - (Math.random() * 60),
            vx: (Math.random() - 0.5) * 2.5,
            vy: 2.8 + (Math.random() * 3.5),
            size: 3 + (Math.random() * 4),
            color: index % 2 === 0 ? "#f1c40f" : "#ffffff",
            opacity: 0.9,
            decay: 0.015,
            gravity: 0.04,
            life: 80
          });
        }
      },
      renderOverlays(ctx) {
        const canvasWidth = ctx.canvas.width;
        const canvasHeight = ctx.canvas.height;
        this.overlays.forEach((overlay) => {
          const fadeRatio = clamp(overlay.remaining / overlay.duration, 0, 1);
          ctx.save();
          ctx.globalAlpha = overlay.opacity * Math.min(1, fadeRatio * 1.5);
          ctx.fillStyle = overlay.color;
          ctx.fillRect(0, 0, canvasWidth, canvasHeight);
          ctx.restore();
        });
      },
      renderImpacts(ctx) {
        this.impacts.forEach((impact) => {
          ctx.save();
          ctx.globalAlpha = impact.opacity;
          ctx.strokeStyle = impact.color;
          ctx.lineWidth = impact.lineWidth;
          ctx.beginPath();
          ctx.arc(impact.x, impact.y, impact.radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        });
      },
      renderParticles(ctx) {
        this.particles.forEach((particle) => {
          switch (particle.type) {
            case "star":
              drawStarParticle(ctx, particle);
              break;
            case "circle":
              ctx.save();
              ctx.globalAlpha = particle.opacity;
              ctx.fillStyle = particle.color;
              ctx.beginPath();
              ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
              break;
            case "spark":
              drawSparkParticle(ctx, particle);
              break;
            case "flame":
              drawFlameParticle(ctx, particle);
              break;
            case "dust":
              ctx.save();
              ctx.globalAlpha = particle.opacity * 0.5;
              ctx.fillStyle = particle.color;
              ctx.beginPath();
              ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
              break;
            case "aura":
              drawAuraParticle(ctx, particle);
              break;
            default:
              break;
          }
        });
      },
      renderOrbitStars(ctx) {
        this.orbitStars.forEach((orbit) => {
          for (let index = 0; index < orbit.count; index += 1) {
            const angle = orbit.angle + (((Math.PI * 2) / orbit.count) * index);
            const starX = orbit.cx + (Math.cos(angle) * orbit.radius);
            const starY = orbit.cy + (Math.sin(angle) * orbit.radius * 0.4);
            ctx.save();
            ctx.globalAlpha = orbit.opacity;
            ctx.fillStyle = "#f1c40f";
            ctx.font = '14px serif';
            ctx.fillText("★", starX - 7, starY + 5);
            ctx.restore();
          }
        });
      },
      renderFloatingTexts(ctx) {
        this.floatingTexts.forEach((floatingText) => {
          ctx.save();
          ctx.globalAlpha = floatingText.opacity;
          ctx.fillStyle = floatingText.color;
          ctx.font = `${floatingText.bold ? "bold " : ""}${floatingText.size}px "Courier New"`;
          ctx.textAlign = "center";
          ctx.strokeStyle = "#000";
          ctx.lineWidth = 3;
          ctx.strokeText(floatingText.text, floatingText.x, floatingText.y);
          ctx.fillText(floatingText.text, floatingText.x, floatingText.y);
          ctx.restore();
        });
      },
      renderDangerPulse(ctx) {
        if (!this.dangerPulse.opacity) {
          return;
        }
        const canvasWidth = ctx.canvas.width;
        const canvasHeight = ctx.canvas.height;
        const halfWidth = canvasWidth / 2;
        ctx.save();
        ctx.globalAlpha = this.dangerPulse.opacity;
        ctx.fillStyle = "#e74c3c";
        if (this.dangerPulse.side === "left") {
          ctx.fillRect(0, 0, 15, canvasHeight);
          ctx.fillRect(0, 0, halfWidth, 10);
          ctx.fillRect(0, canvasHeight - 10, halfWidth, 10);
        } else {
          ctx.fillRect(canvasWidth - 15, 0, 15, canvasHeight);
          ctx.fillRect(halfWidth, 0, halfWidth, 10);
          ctx.fillRect(halfWidth, canvasHeight - 10, halfWidth, 10);
        }
        ctx.restore();
      },
      renderFlashes(ctx) {
        const canvasWidth = ctx.canvas.width;
        const canvasHeight = ctx.canvas.height;
        this.flashes.forEach((flash) => {
          ctx.save();
          ctx.globalAlpha = flash.opacity;
          ctx.fillStyle = flash.color;
          ctx.fillRect(0, 0, canvasWidth, canvasHeight);
          ctx.restore();
        });
      }
    };
  }

  const effectEngine = createCanvasEffectEngine();
  window.effectEngine = effectEngine;

  function ensureBattleEffectState() {
    if (!("effectBattle" in matchAnimationState)) {
      matchAnimationState.effectBattle = null;
    }
    if (!("effectEventIndex" in matchAnimationState)) {
      matchAnimationState.effectEventIndex = -1;
    }
    if (!("effectOutroBattle" in matchAnimationState)) {
      matchAnimationState.effectOutroBattle = null;
    }
    if (!("lastCanvasTime" in matchAnimationState)) {
      matchAnimationState.lastCanvasTime = 0;
    }
    if (!("damageNumberOffset" in matchAnimationState)) {
      matchAnimationState.damageNumberOffset = 0;
    }
  }

  function resetBattleEffectState() {
    ensureBattleEffectState();
    matchAnimationState.effectBattle = null;
    matchAnimationState.effectEventIndex = -1;
    matchAnimationState.effectOutroBattle = null;
    matchAnimationState.damageNumberOffset = 0;
    commentary.lastDangerKey = "";
    centerTextDisplay = null;
    line1Writer.clear();
    line2Writer.clear();
  }

  function drawSceneImageCover(ctx, imagePath, alpha = 1) {
    const image = getSpriteImage(imagePath);
    if (!image || !image.complete || !image.width || !image.height) {
      return false;
    }
    const scale = Math.max(CANVAS_WIDTH / image.width, SCENE_HEIGHT / image.height);
    const width = image.width * scale;
    const height = image.height * scale;
    const x = (CANVAS_WIDTH - width) / 2;
    const y = (SCENE_HEIGHT - height) / 2;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.drawImage(image, x, y, width, height);
    ctx.restore();
    return true;
  }

  function prepareSceneCanvas(ctx) {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = "#0d0d0d";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  function setIdleCommentary() {
    commentary.currentTurn = 0;
    commentary.maxTurns = 60;
    commentary.currentPhase = titleScreenVisible ? "TITLE SCREEN" : "PROMOTION HUB";
    if (titleScreenVisible) {
      applyCommentaryState("RING DYNASTY", "무대는 이미 준비됐다", "normal", "#ecf0f1", "#f1c40f", { instant: true });
    } else {
      applyCommentaryState(
        "이번 주 카드를 준비하고 단체를 운영하세요",
        pendingWeeklySummary ? "결산 대기 중입니다" : "서킷과 PPV를 향해 전진 중",
        "normal",
        "#ecf0f1",
        "#95a5a6",
        { instant: true }
      );
    }
  }

  function renderPinCountText(ctx, pinResult, progress) {
    if (!pinResult) {
      return;
    }
    ctx.save();
    ctx.fillStyle = "#ecf0f1";
    ctx.font = '24px "Courier New"';
    ctx.textAlign = "center";
    if (progress < 0.33) {
      ctx.fillText("1 ...", ctx.canvas.width / 2, 110);
    } else if (progress < 0.66) {
      ctx.fillText("2 ...", ctx.canvas.width / 2, 110);
    } else {
      ctx.fillText(pinResult.pinText, ctx.canvas.width / 2, 110);
    }
    ctx.restore();
  }

  const MOVE_PROFILES = {
    basic: {
      rushDistance: 80,
      knockback: 20,
      shakeIntensity: 4,
      windupDuration: 200,
      rushDuration: 130,
      impactDuration: 80,
      returnDuration: 320,
      pauseDuration: 250,
      soundType: "basic",
      color: "#ecf0f1"
    },
    power: {
      rushDistance: 130,
      knockback: 48,
      shakeIntensity: 9,
      windupDuration: 350,
      rushDuration: 120,
      impactDuration: 150,
      returnDuration: 420,
      pauseDuration: 320,
      soundType: "power",
      color: "#ff8b3d"
    },
    technical: {
      rushDistance: 100,
      knockback: 28,
      shakeIntensity: 5,
      windupDuration: 250,
      rushDuration: 150,
      impactDuration: 100,
      returnDuration: 360,
      pauseDuration: 260,
      soundType: "technical",
      color: "#63bbff"
    },
    finisher: {
      rushDistance: 170,
      knockback: 96,
      shakeIntensity: 18,
      windupDuration: 600,
      rushDuration: 100,
      impactDuration: 300,
      returnDuration: 440,
      pauseDuration: 420,
      soundType: "finisher",
      color: "#e74c3c"
    }
  };

  function updateCenterText(delta) {
    if (!centerTextDisplay) {
      return;
    }
    centerTextDisplay.elapsed += delta;
    if (centerTextDisplay.elapsed >= centerTextDisplay.duration) {
      centerTextDisplay = null;
    }
  }

  function showCenterText(text, color, size, options = {}) {
    centerTextDisplay = {
      text: String(text || ""),
      color: color || "#f1c40f",
      size: Number.isFinite(options.size) ? options.size : (size || 44),
      y: Number.isFinite(options.y) ? options.y : (SCENE_HEIGHT * 0.42),
      duration: Number.isFinite(options.duration) ? options.duration : 1800,
      elapsed: 0
    };
  }

  function renderCenterText(ctx) {
    if (!centerTextDisplay?.text) {
      return;
    }
    const progress = clamp(centerTextDisplay.elapsed / centerTextDisplay.duration, 0, 1);
    const fadeIn = clamp(progress / 0.18, 0, 1);
    const fadeOut = clamp((1 - progress) / 0.22, 0, 1);
    const opacity = Math.min(fadeIn, fadeOut);
    const yLift = (1 - opacity) * 8;
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.textAlign = "center";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 4;
    ctx.fillStyle = centerTextDisplay.color;
    ctx.font = `bold ${centerTextDisplay.size}px "Courier New"`;
    ctx.strokeText(centerTextDisplay.text, CANVAS_WIDTH / 2, centerTextDisplay.y - yLift);
    ctx.fillText(centerTextDisplay.text, CANVAS_WIDTH / 2, centerTextDisplay.y - yLift);
    ctx.restore();
  }

  function getEventPreAttacker(event) {
    return event.attackerId === event.beforeLeft?.id ? event.beforeLeft : event.beforeRight;
  }

  function getEventPreDefender(event) {
    return event.defenderId === event.beforeLeft?.id ? event.beforeLeft : event.beforeRight;
  }

  function getEventMaxTurns(battlePackage) {
    return Math.max(1, battlePackage?.battleResult?.turnLimit || battlePackage?.battleResult?.totalTurns || 1);
  }

  function getMoveProfile(event) {
    const key = event.type === "finisher" || event.type === "finisher-counter"
      ? "finisher"
      : event.moveType === "power"
        ? "power"
        : (event.moveType === "technical" || event.type === "submission")
          ? "technical"
          : "basic";
    const profile = { ...MOVE_PROFILES[key], key };
    if (event.isCrit && key !== "finisher") {
      profile.shakeIntensity += 3;
      profile.soundType = "critical";
      profile.color = "#f1c40f";
    }
    if (event.type === "miss") {
      profile.knockback = 10;
      profile.impactDuration = 70;
      profile.pauseDuration = 220;
      profile.shakeIntensity = 2;
    }
    if (event.type === "finisher-counter") {
      profile.knockback = 42;
      profile.impactDuration = 180;
      profile.pauseDuration = 300;
      profile.soundType = "power";
    }
    return profile;
  }

  function getEventTimingProfile(event, battlePackage) {
    if (event.__canvasTimingProfile) {
      return event.__canvasTimingProfile;
    }
    const attacker = getEventPreAttacker(event);
    const defender = getEventPreDefender(event);
    const turn = event.turn || 1;
    const maxTurns = getEventMaxTurns(battlePackage);
    const tech = attacker?.stats?.technique || 55;
    let scale = 1;
    if (turn <= 10) {
      scale *= 1.18;
    } else if (turn >= 41 || (turn / maxTurns) >= 0.75) {
      scale *= 0.84;
    }
    if (tech >= 85) {
      scale *= 0.86;
    } else if (tech >= 70) {
      scale *= 0.92;
    } else if (tech <= 50) {
      scale *= 1.12;
    }
    scale *= BATTLE_TEMPO_MULTIPLIER;
    const defenderCritical = (defender?.currentHP || 0) / Math.max(1, defender?.maxHP || 1) < 0.3;
    const extraPause = defenderCritical ? Math.round(160 * BATTLE_TEMPO_MULTIPLIER) : 0;

    if (["rest", "stunned", "time-limit", "escape"].includes(event.type)) {
      const totalDuration = Math.round((event.type === "time-limit" ? 1400 : 1000) * scale) + extraPause;
      event.__canvasTimingProfile = {
        totalDuration,
        phases: [{ name: "pause", start: 0, end: totalDuration, duration: totalDuration }],
        impactStart: 0,
        impactEnd: 0,
        returnStart: 0
      };
      return event.__canvasTimingProfile;
    }

    const profile = getMoveProfile(event);
    const phases = [
      { name: "windup", duration: Math.round(profile.windupDuration * scale) },
      { name: "rush", duration: Math.round(profile.rushDuration * scale) },
      { name: "impact", duration: Math.round(profile.impactDuration * scale) },
      { name: "return", duration: Math.round(profile.returnDuration * scale) },
      { name: "pause", duration: Math.round((profile.pauseDuration * scale) + extraPause) }
    ];
    let cursor = 0;
    phases.forEach((phase) => {
      phase.start = cursor;
      phase.end = cursor + phase.duration;
      cursor = phase.end;
    });
    event.__canvasTimingProfile = {
      totalDuration: cursor,
      phases,
      impactStart: phases[2].start,
      impactEnd: phases[2].end,
      returnStart: phases[3].start
    };
    return event.__canvasTimingProfile;
  }

  function buildBattleTimeline(battlePackage) {
    if (battlePackage.__canvasTimeline) {
      return battlePackage.__canvasTimeline;
    }
    let cursor = INTRO_DURATION;
    const events = battlePackage.battleEvents.map((event) => {
      const timing = getEventTimingProfile(event, battlePackage);
      const segment = {
        event,
        timing,
        start: cursor,
        end: cursor + timing.totalDuration
      };
      cursor = segment.end;
      return segment;
    });
    battlePackage.__canvasTimeline = {
      introDuration: INTRO_DURATION,
      events,
      outroStart: cursor,
      totalDuration: cursor + OUTRO_DURATION
    };
    return battlePackage.__canvasTimeline;
  }

  function getPhaseState(timing, localElapsed) {
    const elapsed = clamp(localElapsed, 0, timing.totalDuration);
    const phase = timing.phases.find((item) => elapsed <= item.end) || timing.phases[timing.phases.length - 1];
    const phaseElapsed = clamp(elapsed - phase.start, 0, phase.duration || 1);
    return {
      name: phase.name,
      progress: phase.duration > 0 ? clamp(phaseElapsed / phase.duration, 0, 1) : 1,
      overallProgress: clamp(elapsed / Math.max(1, timing.totalDuration), 0, 1)
    };
  }

  function clearTransientEffects() {
    effectEngine.particles = [];
    effectEngine.impacts = [];
    effectEngine.flashes = [];
    effectEngine.overlays = [];
    effectEngine.floatingTexts = [];
    effectEngine.orbitStars = [];
    effectEngine.timers = [];
    effectEngine.shakes = { x: 0, y: 0, intensity: 0, duration: 0, elapsed: 0 };
    effectEngine.setDangerPulse(false);
  }

  function spawnDamageNumber(x, y, damage, isCrit = false, hitIndex = 0) {
    const stackIndex = matchAnimationState.damageNumberOffset || 0;
    const offsetX = ((hitIndex % 2 === 0 ? -1 : 1) * (10 + (hitIndex * 6))) + ((Math.random() - 0.5) * 10);
    const offsetY = stackIndex * 26;
    effectEngine.floatingTexts.push({
      x: x + offsetX,
      y: y - offsetY,
      text: isCrit && hitIndex === 0 ? `CRIT! ${damage}` : `-${damage}`,
      color: isCrit && hitIndex === 0 ? "#f1c40f" : "#ffffff",
      size: isCrit && hitIndex === 0 ? 28 : 22,
      bold: true,
      opacity: 1,
      vy: -2.4,
      vx: (Math.random() - 0.5) * 0.25,
      life: 80,
      friction: 0.94
    });
    matchAnimationState.damageNumberOffset = stackIndex + 1;
    effectEngine.scheduleAction(520, () => {
      matchAnimationState.damageNumberOffset = Math.max(0, (matchAnimationState.damageNumberOffset || 0) - 1);
    });
  }

  function getCommentaryTheme(event) {
    if (event.type === "finisher" || event.type === "finisher-counter") {
      return { bg: "finisher", color: "#e74c3c" };
    }
    if (event.isCrit) {
      return { bg: "critical", color: "#f1c40f" };
    }
    if (event.moveType === "power") {
      return { bg: "power", color: "#ff8b3d" };
    }
    if (event.type === "pin" || event.pinResult) {
      return { bg: "down", color: "#f4deff" };
    }
    return {
      bg: "normal",
      color: event.moveType === "technical" || event.type === "submission" ? "#63bbff" : "#ecf0f1"
    };
  }

  function getWindupText(attackerName, defenderName, event) {
    if (event.type === "escape") {
      return `${attackerName}가 철창을 향해 몸을 던진다...`;
    }
    if (event.type === "rest") {
      return `${attackerName}가 호흡을 고른다...`;
    }
    if (event.type === "stunned") {
      return `${attackerName}가 움직이지 못한다...`;
    }
    if (event.type === "time-limit") {
      return "경기장에 침묵이 내려앉는다...";
    }
    if (event.type === "finisher" || event.type === "finisher-counter") {
      return "";
    }
    if (event.moveType === "power") {
      return `${attackerName}가 전력을 다해 도약한다!`;
    }
    if (event.moveType === "technical" || event.type === "submission") {
      return `${attackerName}가 ${defenderName}의 빈틈을 노린다...`;
    }
    return `${attackerName}가 ${defenderName}에게 달려든다`;
  }

  function getImpactText(attackerName, defenderName, event) {
    if (event.type === "miss") {
      return (event.resultText || "").includes("DODGE")
        ? `회피!! ${defenderName}가 빠져나간다!`
        : `막혔다!! ${defenderName}가 버텨낸다!`;
    }
    if (event.type === "finisher-counter") {
      return `카운터!! ${attackerName}가 되받아친다!`;
    }
    if (event.type === "time-limit") {
      return event.resultText || "TIME LIMIT!";
    }
    if (event.type === "escape") {
      return event.success ? "탈출 성공!" : "저지당했다!";
    }
    if (event.type === "rest") {
      return event.resultText || "스태미나를 회복했다.";
    }
    if (event.type === "stunned") {
      return event.resultText || "아무것도 하지 못했다.";
    }
    if (event.type === "finisher") {
      return `${event.moveName || "FINISHER"}!!!`;
    }
    if (event.pinResult?.escapedAt > 0) {
      return event.pinResult.pinText || "KICK OUT!";
    }
    if (event.pinResult?.winner) {
      return "하나... 둘... 셋!!!";
    }
    if (event.type === "pin") {
      return `다운!! ${event.damage || 0}!!`;
    }
    if (event.isCrit) {
      return `치명타!! ${event.damage || 0}!!`;
    }
    if (event.moveType === "power") {
      return `강력한 일격!! ${event.damage || 0}!!`;
    }
    if (event.moveType === "technical" || event.type === "submission") {
      return `테크니컬 히트!! ${event.damage || 0}!!`;
    }
    return `명중!! ${event.damage || 0}!!`;
  }

  function drawPanelGauge(ctx, x, y, width, label, ratio, color, alignRight = false) {
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(x, y, width, 7);
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width * clamp(ratio, 0, 1), 7);
    ctx.fillStyle = "#9aa4b2";
    ctx.font = '9px "Courier New"';
    ctx.textAlign = alignRight ? "right" : "left";
    ctx.fillText(label, alignRight ? x + width : x, y - 2);
  }

  function renderBattleHud(ctx, leftSnapshot, rightSnapshot, phaseLabel = "") {
    const panelWidth = 186;
    const panelHeight = 52;
    const leftX = 14;
    const rightX = CANVAS_WIDTH - panelWidth - 14;
    const panelY = 16;
    [
      { x: leftX, snapshot: leftSnapshot, alignRight: false },
      { x: rightX, snapshot: rightSnapshot, alignRight: true }
    ].forEach(({ x, snapshot, alignRight }) => {
      ctx.save();
      ctx.fillStyle = "rgba(8, 10, 16, 0.88)";
      ctx.strokeStyle = "rgba(231, 76, 60, 0.22)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(x, panelY, panelWidth, panelHeight, 10);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#ecf0f1";
      ctx.font = 'bold 11px "Courier New"';
      ctx.textAlign = alignRight ? "right" : "left";
      ctx.fillText(snapshot.name, alignRight ? x + panelWidth - 10 : x + 10, panelY + 14);
      drawPanelGauge(ctx, x + 10, panelY + 24, panelWidth - 20, `HP ${Math.floor(snapshot.currentHP)}/${Math.floor(snapshot.maxHP)}`, snapshot.currentHP / Math.max(1, snapshot.maxHP), snapshot.currentHP / Math.max(1, snapshot.maxHP) > 0.5 ? "#2ecc71" : snapshot.currentHP / Math.max(1, snapshot.maxHP) > 0.2 ? "#f39c12" : "#e74c3c", alignRight);
      drawPanelGauge(ctx, x + 10, panelY + 37, (panelWidth - 26) / 2, "STA", snapshot.currentStamina / Math.max(1, snapshot.maxStamina), "#3498db", false);
      drawPanelGauge(ctx, x + 16 + ((panelWidth - 26) / 2), panelY + 37, (panelWidth - 26) / 2, "FIN", snapshot.finisherGauge / 100, snapshot.finisherGauge >= 100 ? "#e74c3c" : "#9b59b6", true);
      ctx.restore();
    });

    ctx.save();
    ctx.fillStyle = "rgba(8, 10, 16, 0.8)";
    ctx.beginPath();
    ctx.roundRect((CANVAS_WIDTH / 2) - 72, 16, 144, 34, 12);
    ctx.fill();
    ctx.strokeStyle = "rgba(231, 76, 60, 0.2)";
    ctx.stroke();
    ctx.fillStyle = "#ecf0f1";
    ctx.font = 'bold 12px "Courier New"';
    ctx.textAlign = "center";
    ctx.fillText(`TURN ${commentary.currentTurn} / ${commentary.maxTurns}`, CANVAS_WIDTH / 2, 30);
    ctx.fillStyle = "#7f8c8d";
    ctx.font = '10px "Courier New"';
    ctx.fillText(phaseLabel || commentary.currentPhase, CANVAS_WIDTH / 2, 42);
    ctx.restore();
  }

  function getCombatantTilt(snapshot, side) {
    const ratio = clamp(snapshot.currentHP / Math.max(1, snapshot.maxHP), 0, 1);
    if (ratio >= 0.3) {
      return 0;
    }
    const maxTilt = side === "left" ? -12 : 12;
    return maxTilt * (1 - (ratio / 0.3));
  }

  function getIdleBob(snapshot, frame) {
    const ratio = clamp(snapshot.currentHP / Math.max(1, snapshot.maxHP), 0, 1);
    const speed = 0.08 - ((1 - ratio) * 0.015);
    const amplitude = 4 + ((1 - ratio) * 3);
    return Math.sin(frame * speed) * amplitude;
  }

  function getCombatantPose(side, snapshot, otherSnapshot, event, phaseState, frame, isAttacker) {
    const baseX = side === "left" ? LEFT_FIGHTER_BASE_X : RIGHT_FIGHTER_BASE_X;
    const baseY = SCENE_FLOOR_Y;
    const profile = getMoveProfile(event);
    const direction = side === "left" ? 1 : -1;
    const windupTarget = baseX - (direction * 30);
    const rushLimit = side === "left"
      ? Math.min(baseX + profile.rushDistance, RIGHT_FIGHTER_BASE_X - 76)
      : Math.max(baseX - profile.rushDistance, LEFT_FIGHTER_BASE_X + 76);
    const knockTarget = baseX + ((side === "left" ? -1 : 1) * profile.knockback);
    const shouldDown = snapshot.isDown || ((otherSnapshot?.isDown || false) && !isAttacker);
    let drawX = baseX;
    let drawY = baseY + (shouldDown ? 0 : getIdleBob(snapshot, frame));
    let tilt = shouldDown ? (side === "left" ? 88 : -88) : getCombatantTilt(snapshot, side);
    let flash = 0;
    let state = shouldDown ? "down" : "idle";

    if (isAttacker && !["rest", "stunned", "time-limit", "escape"].includes(event.type)) {
      state = "attack";
      if (phaseState.name === "windup") {
        drawX = lerpValue(baseX, windupTarget, easeOutCubic(phaseState.progress));
      } else if (phaseState.name === "rush") {
        drawX = lerpValue(windupTarget, rushLimit, phaseState.progress);
      } else if (phaseState.name === "impact") {
        drawX = rushLimit;
      } else if (phaseState.name === "return") {
        drawX = lerpValue(rushLimit, baseX, easeOutCubic(phaseState.progress));
      }
      drawY = baseY - (phaseState.name === "rush" ? Math.sin(phaseState.progress * Math.PI) * 6 : 0);
    } else if (!isAttacker && !["rest", "stunned", "time-limit", "escape"].includes(event.type)) {
      if (phaseState.name === "impact") {
        drawX = lerpValue(baseX, knockTarget, phaseState.progress);
        flash = 1 - phaseState.progress;
      } else if (phaseState.name === "return") {
        drawX = lerpValue(knockTarget, shouldDown ? knockTarget : baseX, easeOutCubic(phaseState.progress));
      } else if (phaseState.name === "pause" && shouldDown) {
        drawX = knockTarget;
      }
      if (shouldDown) {
        const downProgress = phaseState.name === "impact"
          ? easeInCubic(phaseState.progress)
          : phaseState.name === "return"
            ? clamp(0.6 + (phaseState.progress * 0.4), 0, 1)
            : phaseState.name === "pause"
              ? 1
              : 0;
        drawY = lerpValue(baseY, baseY + 80, downProgress);
        tilt = lerpValue(getCombatantTilt(snapshot, side), side === "left" ? 88 : -88, downProgress);
        state = "down";
      } else if (event.damage > 0) {
        state = "walk";
      }
      if (phaseState.name === "impact" && event.damage > 0) {
        drawX += (Math.random() - 0.5) * 8;
      }
    }

    return {
      x: drawX,
      y: drawY,
      tilt,
      flash,
      state,
      down: shouldDown
    };
  }

  function drawCombatantShadow(ctx, pose) {
    ctx.save();
    ctx.globalAlpha = pose.down ? 0.22 : 0.28;
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.ellipse(pose.x, SCENE_FLOOR_Y + 10, pose.down ? 54 : 34, pose.down ? 12 : 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawCombatant(ctx, snapshot, pose, frame, side) {
    const standImage = getSpriteImage(getResolvedStandSpriteSheet(snapshot));
    const useCustomStand = isCustomStandSprite(snapshot) && standImage && standImage.complete && standImage.width && standImage.height;
    drawCombatantShadow(ctx, pose);
    if (!useCustomStand) {
      drawBattleWrestler(ctx, snapshot, pose.x, pose.y - 8, frame, pose.state, side === "right");
      return;
    }

    const hpRatio = clamp(snapshot.currentHP / Math.max(1, snapshot.maxHP), 0, 1);
    const scale = Math.min(FIGHTER_DRAW_WIDTH / standImage.width, FIGHTER_DRAW_HEIGHT / standImage.height);
    const drawWidth = standImage.width * scale;
    const drawHeight = standImage.height * scale;

    const groundOffset = pose.down ? CUSTOM_STAND_DOWN_OFFSET : CUSTOM_STAND_GROUND_OFFSET;
    ctx.save();
    ctx.translate(pose.x, pose.y + groundOffset);
    if (side === "right") {
      ctx.scale(-1, 1);
    }
    ctx.rotate((pose.tilt * Math.PI) / 180);
    if (pose.flash > 0) {
      ctx.filter = `brightness(${1 + (pose.flash * 2.8)})`;
    } else if (hpRatio < 0.4) {
      ctx.filter = `saturate(${Math.max(24, Math.round(hpRatio * 220))}%)`;
    }
    ctx.drawImage(standImage, -(drawWidth / 2), -drawHeight, drawWidth, drawHeight);
    ctx.restore();
  }

  function drawBattleArenaForeground(ctx, useMainArenaImage = false) {
    if (useMainArenaImage) {
      return;
    }
    const ropeRows = [
      { y: 236, alpha: 0.42, width: 3.5 },
      { y: 255, alpha: 0.52, width: 4 },
      { y: 274, alpha: 0.36, width: 3.5 }
    ];
    ctx.save();
    ropeRows.forEach((rope, index) => {
      ctx.strokeStyle = `rgba(176, 34, 34, ${rope.alpha})`;
      ctx.lineWidth = rope.width;
      ctx.beginPath();
      ctx.moveTo(54, rope.y + (index * 0.6));
      ctx.lineTo(CANVAS_WIDTH - 54, rope.y - (index * 0.6));
      ctx.stroke();
    });
    ctx.fillStyle = "rgba(215, 220, 224, 0.6)";
    ctx.fillRect(48, 208, 8, 104);
    ctx.fillRect(CANVAS_WIDTH - 56, 208, 8, 104);
    ctx.restore();
  }

  function renderPinOverlay(ctx, event, timing, localElapsed) {
    if (!event.pinResult) {
      return;
    }
    const pinProgress = clamp((localElapsed - timing.impactStart) / Math.max(1, timing.totalDuration - timing.impactStart), 0, 1);
    let text = "하나...";
    if (pinProgress >= 0.66) {
      text = event.pinResult.winner
        ? "하나... 둘... 셋!!!"
        : (event.pinResult.pinText || "KICK OUT!");
    } else if (pinProgress >= 0.33) {
      text = "하나... 둘...";
    }
    ctx.save();
    ctx.fillStyle = event.pinResult.winner ? "#f1c40f" : "#ecf0f1";
    ctx.font = '22px "Courier New"';
    ctx.textAlign = "center";
    ctx.fillText(text, CANVAS_WIDTH / 2, 108);
    ctx.restore();
  }

  function applyDangerPulse(leftSnapshot, rightSnapshot) {
    const leftRatio = clamp(leftSnapshot.currentHP / Math.max(1, leftSnapshot.maxHP), 0, 1);
    const rightRatio = clamp(rightSnapshot.currentHP / Math.max(1, rightSnapshot.maxHP), 0, 1);
    if (leftRatio <= 0.3 || rightRatio <= 0.3) {
      effectEngine.setDangerPulse(true, leftRatio <= rightRatio ? "left" : "right");
      return;
    }
    effectEngine.setDangerPulse(false);
  }

  function triggerBattleEventEffects(battlePackage, event, timing, impactX, impactY, attackerX, attackerY, defenderX, defenderY) {
    ensureBattleEffectState();
    const eventIndex = battlePackage.battleEvents.indexOf(event);
    if (matchAnimationState.effectBattle === battlePackage && matchAnimationState.effectEventIndex === eventIndex) {
      return;
    }

    matchAnimationState.effectBattle = battlePackage;
    matchAnimationState.effectEventIndex = eventIndex;
    matchAnimationState.damageNumberOffset = 0;

    const attacker = getEventPreAttacker(event);
    const defender = getEventPreDefender(event);
    const theme = getCommentaryTheme(event);
    commentary.currentTurn = event.turn || 0;
    commentary.maxTurns = getEventMaxTurns(battlePackage);
    commentary.currentPhase = "WINDUP";

    if (event.type === "finisher" || event.type === "finisher-counter") {
      applyCommentaryState("", "", theme.bg, "#95a5a6", theme.color, { instant: true });
      effectEngine.scheduleAction(Math.max(180, Math.round(timing.impactStart * 0.35)), () => {
        applyCommentaryState("...", "", theme.bg, "#95a5a6", theme.color, { line1Speed: 120, skipLine2: true });
      });
      effectEngine.scheduleAction(Math.max(360, timing.impactStart - 240), () => {
        applyCommentaryState("...이건...", "", theme.bg, "#95a5a6", theme.color, { line1Speed: 120, skipLine2: true });
      });
    } else {
      applyCommentaryState(
        getWindupText(attacker?.name || "", defender?.name || "", event),
        "",
        theme.bg,
        "#95a5a6",
        theme.color,
        { line1Speed: 25, skipLine2: true }
      );
    }

    effectEngine.scheduleAction(timing.impactStart, () => {
      if (event.type === "rest") {
        effectEngine.addFloatingText(attackerX, attackerY - 70, "RECOVER", "#2ecc71", 16, true);
        applyCommentaryState(getWindupText(attacker?.name || "", defender?.name || "", event), getImpactText(attacker?.name || "", defender?.name || "", event), "normal", "#95a5a6", "#2ecc71", { skipLine1: true, line2Speed: 38 });
        return;
      }
      if (event.type === "stunned") {
        effectEngine.addFloatingText(attackerX, attackerY - 72, "STUNNED", "#f39c12", 18, true);
        applyCommentaryState(getWindupText(attacker?.name || "", defender?.name || "", event), getImpactText(attacker?.name || "", defender?.name || "", event), "normal", "#95a5a6", "#f39c12", { skipLine1: true, line2Speed: 38 });
        return;
      }
      if (event.type === "time-limit") {
        clearTransientEffects();
        effectEngine.addScreenFlash("#ffffff", 0.25, 220);
        showCenterText("TIME LIMIT!", "#f1c40f", 32, { duration: 1200 });
        applyCommentaryState("시간 제한 도달!", getImpactText(attacker?.name || "", defender?.name || "", event), "critical", "#95a5a6", "#f1c40f", { line1Speed: 25, line2Speed: 52 });
        return;
      }
      if (event.type === "escape") {
        effectEngine.addFloatingText(attackerX, attackerY - 72, event.success ? "ESCAPE!" : "STOPPED!", event.success ? "#2ecc71" : "#e74c3c", 20, true);
        applyCommentaryState(event.actionText || `${attacker?.name || ""}가 철창 탈출을 시도한다!`, getImpactText(attacker?.name || "", defender?.name || "", event), "normal", "#95a5a6", event.success ? "#2ecc71" : "#e74c3c", { line1Speed: 25, line2Speed: 40 });
        return;
      }

      const profile = getMoveProfile(event);
      playHitSound(profile.soundType);

      if (event.type === "miss") {
        effectEngine.addImpactRing(impactX, impactY, "#95a5a6", 30, 3);
        effectEngine.addFloatingText(defenderX, defenderY - 86, (event.resultText || "").includes("DODGE") ? "DODGE!" : "BLOCK!", "#95a5a6", 18, true);
      } else if (event.type === "finisher-counter") {
        effectEngine.addPowerHit(attackerX, attackerY - 90);
        effectEngine.addFloatingText(attackerX, attackerY - 114, "COUNTER!", "#e74c3c", 24, true);
      } else if (event.damage > 0) {
        if (event.type === "finisher") {
          effectEngine.addFinisher(impactX, impactY, event.moveName, CANVAS_WIDTH, SCENE_HEIGHT);
          showCenterText(event.moveName || "FINISHER", "#f1c40f", 42, { duration: 1800 });
        } else if (event.isCrit) {
          effectEngine.addCriticalHit(impactX, impactY);
        } else if (event.moveType === "power") {
          effectEngine.addPowerHit(impactX, impactY);
        } else {
          effectEngine.addBasicHit(impactX, impactY);
          if (event.moveType === "technical" || event.type === "submission") {
            effectEngine.addImpactRing(impactX, impactY, "#63bbff", 44, 4);
          }
        }

        const hitDamages = Array.isArray(event.hitDamages) && event.hitDamages.length ? event.hitDamages : [event.damage];
        hitDamages.forEach((damage, hitIndex) => {
          effectEngine.scheduleAction(hitIndex * 70, () => {
            spawnDamageNumber(defenderX, defenderY - 140, damage, event.isCrit, hitIndex);
          });
        });
        if (hitDamages.length >= 2) {
          effectEngine.addFloatingText(attackerX, attackerY - 112, `${hitDamages.length} HIT`, "#ecf0f1", 14, true);
        }
      }

      if (event.type === "pin" || event.type === "finisher" || event.pinResult) {
        effectEngine.addDown(defenderX, SCENE_FLOOR_Y + 6);
      }
      if (event.pinResult?.escapedAt > 0) {
        effectEngine.scheduleAction(260, () => {
          effectEngine.addFloatingText(defenderX, defenderY - 112, event.pinResult.pinText || "KICK OUT!", "#2ecc71", 22, true);
          applyCommentaryState(commentary.line1.text, event.pinResult.pinText || "KICK OUT!", "down", "#95a5a6", "#2ecc71", { skipLine1: true, line2Speed: 42 });
        });
      }
      applyCommentaryState(commentary.line1.text, getImpactText(attacker?.name || "", defender?.name || "", event), theme.bg, commentary.line1.color, event.pinResult?.escapedAt > 0 ? "#2ecc71" : theme.color, {
        skipLine1: true,
        line2Speed: event.type === "finisher" ? 110 : event.isCrit ? 80 : 50
      });
    });
  }

  const originalStartMatchAnimation = startMatchAnimation;
  startMatchAnimation = function (matchQueue) {
    ensureBattleEffectState();
    resumeBattleAudioContext();
    effectEngine.reset();
    resetBattleEffectState();
    matchAnimationState.lastCanvasTime = performance.now();
    return originalStartMatchAnimation(matchQueue);
  };

  const originalFinishMatchAnimation = finishMatchAnimation;
  finishMatchAnimation = function () {
    ensureBattleEffectState();
    effectEngine.reset();
    resetBattleEffectState();
    matchAnimationState.lastCanvasTime = 0;
    return originalFinishMatchAnimation();
  };

  drawBattleLog = function () {};

  function drawMainBattleBackground(ctx) {
    if (!drawSceneImageCover(ctx, MAIN_BATTLE_BACKGROUND_PATH, 1)) {
      return false;
    }
    const topShade = ctx.createLinearGradient(0, 0, 0, SCENE_HEIGHT * 0.48);
    topShade.addColorStop(0, "rgba(4, 6, 10, 0.08)");
    topShade.addColorStop(1, "rgba(4, 6, 10, 0)");
    ctx.fillStyle = topShade;
    ctx.fillRect(0, 0, CANVAS_WIDTH, SCENE_HEIGHT * 0.48);
    const vignette = ctx.createRadialGradient(CANVAS_WIDTH / 2, 180, 120, CANVAS_WIDTH / 2, 180, 420);
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, "rgba(0,0,0,0.22)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, CANVAS_WIDTH, SCENE_HEIGHT);
    return true;
  }

  drawBattleArena = function (ctx, hypeValue, frame, useMainArenaImage = false) {
    prepareSceneCanvas(ctx);
    if (useMainArenaImage && drawMainBattleBackground(ctx)) {
      return true;
    }
    const skyGradient = ctx.createLinearGradient(0, 0, 0, SCENE_HEIGHT);
    skyGradient.addColorStop(0, "#05060b");
    skyGradient.addColorStop(0.48, "#11131b");
    skyGradient.addColorStop(1, "#19120f");
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, SCENE_HEIGHT);

    ctx.fillStyle = "rgba(255,255,255,0.03)";
    ctx.fillRect(0, 0, CANVAS_WIDTH, 120);

    ctx.save();
    ctx.globalAlpha = 0.7;
    drawCrowd(ctx, hypeValue, frame);
    ctx.restore();

    [120, 320, 520].forEach((x, index) => {
      const beam = ctx.createLinearGradient(x, 0, x, 250);
      beam.addColorStop(0, `rgba(255,255,220,${index === 1 ? 0.18 : 0.12})`);
      beam.addColorStop(1, "rgba(255,255,220,0)");
      ctx.fillStyle = beam;
      ctx.beginPath();
      ctx.moveTo(x - 40, 0);
      ctx.lineTo(x + 40, 0);
      ctx.lineTo(x + 100, 230);
      ctx.lineTo(x - 100, 230);
      ctx.closePath();
      ctx.fill();
    });

    const floorGradient = ctx.createLinearGradient(0, 210, 0, SCENE_HEIGHT);
    floorGradient.addColorStop(0, "rgba(28, 18, 16, 0.3)");
    floorGradient.addColorStop(1, "#120d0c");
    ctx.fillStyle = floorGradient;
    ctx.fillRect(0, 210, CANVAS_WIDTH, SCENE_HEIGHT - 210);

    ctx.fillStyle = "#181312";
    ctx.beginPath();
    ctx.moveTo(30, 242);
    ctx.lineTo(CANVAS_WIDTH - 30, 242);
    ctx.lineTo(CANVAS_WIDTH - 8, SCENE_HEIGHT);
    ctx.lineTo(8, SCENE_HEIGHT);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(255, 180, 120, 0.08)";
    ctx.beginPath();
    ctx.ellipse(CANVAS_WIDTH / 2, 318, 220, 48, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(185, 38, 38, 0.55)";
    ctx.lineWidth = 3;
    [178, 196, 214].forEach((y) => {
      ctx.beginPath();
      ctx.moveTo(42, y);
      ctx.lineTo(CANVAS_WIDTH - 42, y);
      ctx.stroke();
    });

    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(38, 168, 6, 84);
    ctx.fillRect(CANVAS_WIDTH - 44, 168, 6, 84);

    const vignette = ctx.createRadialGradient(CANVAS_WIDTH / 2, 180, 80, CANVAS_WIDTH / 2, 180, 420);
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, "rgba(0,0,0,0.45)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, CANVAS_WIDTH, SCENE_HEIGHT);
    return false;
  };

  drawTitleScreenCanvas = function (ctx, now) {
    prepareSceneCanvas(ctx);
    drawBattleArena(ctx, gameState.hype, now / 16);
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(0, 0, CANVAS_WIDTH, SCENE_HEIGHT);
    drawCanvasImageContain(ctx, GENERATED_UI_ASSETS.logo, 100, 90, 440, 120, 1);
    ctx.fillStyle = "#ecf0f1";
    ctx.textAlign = "center";
    ctx.font = '14px "Courier New"';
    ctx.fillText("A darker road to the top of the card.", CANVAS_WIDTH / 2, 228);
  };

  drawIdleHomeCanvas = function (ctx) {
    drawBattleArena(ctx, gameState.hype, performance.now() / 16);
    ctx.fillStyle = "rgba(0,0,0,0.34)";
    ctx.fillRect(0, 0, CANVAS_WIDTH, SCENE_HEIGHT);
    ctx.fillStyle = "#ecf0f1";
    ctx.textAlign = "center";
    ctx.font = '20px "Courier New"';
    ctx.fillText(`Week ${gameState.week} - ${getHomeArenaLabel()}`, CANVAS_WIDTH / 2, 172);
    ctx.font = '12px "Courier New"';
    getHomeMatchPreviewLines().forEach((line, index) => {
      ctx.fillText(line, CANVAS_WIDTH / 2, 272 + (index * 18));
    });
  };

  drawBattleIntro = function (ctx, battlePackage, progress, frame) {
    const leftSnapshot = snapshotBattleState(battlePackage.leftState);
    const rightSnapshot = snapshotBattleState(battlePackage.rightState);
    if (matchAnimationState.effectBattle !== battlePackage || matchAnimationState.effectEventIndex !== -2) {
      matchAnimationState.effectBattle = battlePackage;
      matchAnimationState.effectEventIndex = -2;
      commentary.currentTurn = 0;
      commentary.maxTurns = getEventMaxTurns(battlePackage);
      commentary.currentPhase = "INTRO";
      applyCommentaryState(`${leftSnapshot.name} vs ${rightSnapshot.name}`, "정적이 흐른다...", "normal", "#95a5a6", "#ecf0f1", {
        line1Speed: 25,
        line2Speed: 50
      });
    }

    const usedMainArenaImage = drawBattleArena(ctx, gameState.hype, frame, true);
    const slide = easeOutCubic(progress);
    const leftPose = {
      x: lerpValue(LEFT_FIGHTER_BASE_X - 120, LEFT_FIGHTER_BASE_X, slide),
      y: SCENE_FLOOR_Y + getIdleBob(leftSnapshot, frame),
      tilt: 0,
      flash: 0,
      state: "idle",
      down: false
    };
    const rightPose = {
      x: lerpValue(RIGHT_FIGHTER_BASE_X + 120, RIGHT_FIGHTER_BASE_X, slide),
      y: SCENE_FLOOR_Y + getIdleBob(rightSnapshot, frame),
      tilt: 0,
      flash: 0,
      state: "idle",
      down: false
    };
    renderBattleHud(ctx, leftSnapshot, rightSnapshot, "INTRO");
    ctx.save();
    ctx.globalAlpha = 0.22 + (progress * 0.2);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, CANVAS_WIDTH, SCENE_HEIGHT);
    ctx.restore();
    drawCombatant(ctx, leftSnapshot, leftPose, frame, "left");
    drawCombatant(ctx, rightSnapshot, rightPose, frame, "right");
    drawBattleArenaForeground(ctx, usedMainArenaImage);
    if (progress > 0.72 && centerTextDisplay?.text !== "FIGHT") {
      showCenterText("FIGHT", "#f1c40f", 42, { duration: 680, y: 156 });
    }
    renderCenterText(ctx);
    renderCommentary(ctx);
  };

  drawBattleEventFrame = function (ctx, battlePackage, event, localElapsed, frame, eventTiming = null) {
    const timing = eventTiming || getEventTimingProfile(event, battlePackage);
    const phaseState = getPhaseState(timing, localElapsed);
    const beforeLeft = event.beforeLeft;
    const beforeRight = event.beforeRight;
    const afterLeft = event.afterLeft;
    const afterRight = event.afterRight;
    const attackerIsLeft = event.attackerId === beforeLeft.id;
    const leftSnapshot = localElapsed >= timing.impactStart ? afterLeft : beforeLeft;
    const rightSnapshot = localElapsed >= timing.impactStart ? afterRight : beforeRight;
    const attackerCurrent = localElapsed >= timing.impactStart ? (attackerIsLeft ? afterLeft : afterRight) : (attackerIsLeft ? beforeLeft : beforeRight);
    const defenderCurrent = localElapsed >= timing.impactStart ? (attackerIsLeft ? afterRight : afterLeft) : (attackerIsLeft ? beforeRight : beforeLeft);
    const attackerAfter = attackerIsLeft ? afterLeft : afterRight;
    const defenderAfter = attackerIsLeft ? afterRight : afterLeft;
    const profile = getMoveProfile(event);
    const attackerImpactX = attackerIsLeft
      ? Math.min(LEFT_FIGHTER_BASE_X + profile.rushDistance, RIGHT_FIGHTER_BASE_X - 76)
      : Math.max(RIGHT_FIGHTER_BASE_X - profile.rushDistance, LEFT_FIGHTER_BASE_X + 76);
    const defenderImpactX = attackerIsLeft ? RIGHT_FIGHTER_BASE_X : LEFT_FIGHTER_BASE_X;

    commentary.currentTurn = event.turn || 0;
    commentary.maxTurns = getEventMaxTurns(battlePackage);
    commentary.currentPhase = phaseState.name.toUpperCase();

    const attackerPose = getCombatantPose(attackerIsLeft ? "left" : "right", attackerCurrent, defenderCurrent, event, phaseState, frame, true);
    const defenderPose = getCombatantPose(attackerIsLeft ? "right" : "left", defenderCurrent, attackerCurrent, event, phaseState, frame, false);
    const leftPose = attackerIsLeft ? attackerPose : defenderPose;
    const rightPose = attackerIsLeft ? defenderPose : attackerPose;
    const impactX = (attackerImpactX + defenderImpactX) / 2;
    const impactY = SCENE_FLOOR_Y - 110;

    applyDangerPulse(leftSnapshot, rightSnapshot);
    triggerBattleEventEffects(
      battlePackage,
      event,
      timing,
      impactX,
      impactY,
      attackerImpactX,
      SCENE_FLOOR_Y,
      defenderImpactX,
      SCENE_FLOOR_Y
    );

    const usedMainArenaImage = drawBattleArena(ctx, event.hypeAfter, frame, true);
    renderBattleHud(ctx, leftSnapshot, rightSnapshot, phaseState.name.toUpperCase());

    const finisherZoom = event.type === "finisher" && (phaseState.name === "rush" || phaseState.name === "impact")
      ? 1 + (0.05 * Math.sin(phaseState.progress * Math.PI))
      : 1;

    ctx.save();
    ctx.translate(CANVAS_WIDTH / 2, SCENE_HEIGHT / 2);
    ctx.scale(finisherZoom, finisherZoom);
    ctx.translate(-(CANVAS_WIDTH / 2), -(SCENE_HEIGHT / 2));
    ctx.translate(effectEngine.shakes.x, effectEngine.shakes.y);
    drawCombatant(ctx, leftSnapshot, leftPose, frame, "left");
    drawCombatant(ctx, rightSnapshot, rightPose, frame, "right");
    drawBattleArenaForeground(ctx, usedMainArenaImage);
    effectEngine.renderImpacts(ctx);
    effectEngine.renderParticles(ctx);
    effectEngine.renderOrbitStars(ctx);
    effectEngine.renderFloatingTexts(ctx);
    ctx.restore();

    if (phaseState.name === "windup") {
      ctx.save();
      ctx.globalAlpha = 0.08 + (phaseState.progress * 0.08);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, CANVAS_WIDTH, SCENE_HEIGHT);
      ctx.restore();
    }

    renderPinOverlay(ctx, event, timing, localElapsed);
    effectEngine.renderDangerPulse(ctx);
    effectEngine.renderOverlays(ctx);
    effectEngine.renderFlashes(ctx);
    renderCenterText(ctx);
    renderCommentary(ctx);
  };

  drawBattleOutro = function (ctx, battlePackage, progress, frame) {
    const lastEvent = battlePackage.battleEvents[battlePackage.battleEvents.length - 1];
    const leftSnapshot = lastEvent ? lastEvent.afterLeft : snapshotBattleState(battlePackage.leftState);
    const rightSnapshot = lastEvent ? lastEvent.afterRight : snapshotBattleState(battlePackage.rightState);
    const winnerId = battlePackage.battleResult.winnerId;
    const winnerSnapshot = winnerId === leftSnapshot.id ? leftSnapshot : rightSnapshot;
    const loserSnapshot = winnerId === leftSnapshot.id ? rightSnapshot : leftSnapshot;
    const winnerSide = winnerId === leftSnapshot.id ? "left" : "right";

    ensureBattleEffectState();
    if (matchAnimationState.effectOutroBattle !== battlePackage) {
      matchAnimationState.effectOutroBattle = battlePackage;
      clearTransientEffects();
      effectEngine.addVictoryBurst(CANVAS_WIDTH, SCENE_HEIGHT);
      commentary.currentTurn = battlePackage.battleResult.totalTurns || 0;
      commentary.maxTurns = getEventMaxTurns(battlePackage);
      commentary.currentPhase = "VICTORY";
      applyCommentaryState(
        `${winnerSnapshot.name}가 마지막 순간을 장식한다!`,
        `${winnerSnapshot.name} 승리!!! 경기 종료!!!`,
        "victory",
        "#95a5a6",
        "#f1c40f",
        { line1Speed: 30, line2Speed: 60, line2Delay: 800 }
      );
      effectEngine.scheduleAction(1800, () => {
        showCenterText("WINNER!", "#f1c40f", 52, { duration: 1400 });
      });
    }

    const usedMainArenaImage = drawBattleArena(ctx, clamp(gameState.hype + battlePackage.battleResult.hypeGenerated, 0, 100), frame, true);
    renderBattleHud(ctx, leftSnapshot, rightSnapshot, "VICTORY");

    applyDangerPulse(leftSnapshot, rightSnapshot);
    const celebration = Math.sin(clamp(progress / 0.28, 0, 1) * Math.PI) * 18;
    const winnerPose = {
      x: winnerSide === "left" ? LEFT_FIGHTER_BASE_X : RIGHT_FIGHTER_BASE_X,
      y: SCENE_FLOOR_Y - celebration,
      tilt: 0,
      flash: 0,
      state: "victory",
      down: false
    };
    const loserPose = {
      x: winnerSide === "left" ? RIGHT_FIGHTER_BASE_X - 18 : LEFT_FIGHTER_BASE_X + 18,
      y: SCENE_FLOOR_Y + 80,
      tilt: winnerSide === "left" ? -88 : 88,
      flash: 0,
      state: "down",
      down: true
    };
    ctx.save();
    ctx.translate(effectEngine.shakes.x, effectEngine.shakes.y);
    if (winnerSide === "left") {
      drawCombatant(ctx, winnerSnapshot, winnerPose, frame, "left");
      drawCombatant(ctx, loserSnapshot, loserPose, frame, "right");
    } else {
      drawCombatant(ctx, loserSnapshot, loserPose, frame, "left");
      drawCombatant(ctx, winnerSnapshot, winnerPose, frame, "right");
    }
    drawBattleArenaForeground(ctx, usedMainArenaImage);
    effectEngine.renderParticles(ctx);
    effectEngine.renderOrbitStars(ctx);
    effectEngine.renderFloatingTexts(ctx);
    ctx.restore();

    effectEngine.renderOverlays(ctx);
    effectEngine.renderFlashes(ctx);
    renderCenterText(ctx);
    renderCommentary(ctx);
  };

  drawBattlePackageFrame = function (ctx, battlePackage, elapsed, frame) {
    const timeline = buildBattleTimeline(battlePackage);
    if (elapsed < timeline.introDuration) {
      drawBattleIntro(ctx, battlePackage, clamp(elapsed / timeline.introDuration, 0, 1), frame);
      matchAnimationState.currentBattle = battlePackage;
      return false;
    }

    const eventSegment = timeline.events.find((segment) => elapsed < segment.end);
    if (eventSegment) {
      drawBattleEventFrame(ctx, battlePackage, eventSegment.event, elapsed - eventSegment.start, frame, eventSegment.timing);
      matchAnimationState.currentBattle = battlePackage;
      return false;
    }

    if (elapsed < timeline.totalDuration) {
      drawBattleOutro(ctx, battlePackage, clamp((elapsed - timeline.outroStart) / OUTRO_DURATION, 0, 1), frame);
      matchAnimationState.currentBattle = battlePackage;
      return false;
    }

    return true;
  };

  drawCurrentCanvasFrame = function (now) {
    ensureBattleEffectState();
    const canvas = document.getElementById("matchCanvas");
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const delta = matchAnimationState.lastCanvasTime ? now - matchAnimationState.lastCanvasTime : 16;
    matchAnimationState.lastCanvasTime = now;
    effectEngine.update(delta);
    line1Writer.update(delta);
    line2Writer.update(delta);
    updateCenterText(delta);

    if (titleScreenVisible) {
      drawTitleScreenCanvas(ctx, now);
      setIdleCommentary();
      renderCommentary(ctx);
      return;
    }

    if (!matchAnimationState.running) {
      drawIdleHomeCanvas(ctx);
      setIdleCommentary();
      renderCommentary(ctx);
      return;
    }

    const currentBattle = matchAnimationState.queue[matchAnimationState.matchIndex];
    if (!currentBattle) {
      finishMatchAnimation();
      return;
    }

    const battleFinished = drawBattlePackageFrame(ctx, currentBattle, now - matchAnimationState.matchStartTime, Math.floor(now / 16));
    if (battleFinished) {
      matchAnimationState.matchIndex += 1;
      if (matchAnimationState.matchIndex >= matchAnimationState.queue.length) {
        finishMatchAnimation();
        return;
      }
      effectEngine.reset();
      resetBattleEffectState();
      matchAnimationState.matchStartTime = now;
      matchAnimationState.currentBattle = matchAnimationState.queue[matchAnimationState.matchIndex];
    }
  };
}());

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

  const commentaryBG = {
    normal: "#1a1a2e",
    power: "#2c1810",
    critical: "#2c2200",
    finisher: "#000000",
    down: "#1a0a1a",
    danger: "#2c0a0a",
    victory: "#0a1a0a"
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

    ctx.font = '16px "Courier New"';
    ctx.fillStyle = commentary.line1.color;
    ctx.textAlign = "left";
    ctx.fillText(fitText(commentary.line1.text, 580), 20, COMMENTARY_Y + 35);

    ctx.font = 'bold 20px "Courier New"';
    ctx.fillStyle = commentary.line2.color;
    ctx.fillText(fitText(commentary.line2.text, 580), 20, COMMENTARY_Y + 75);

    ctx.font = '12px "Courier New"';
    ctx.fillStyle = "#7f8c8d";
    ctx.textAlign = "right";
    ctx.fillText(`TURN ${commentary.currentTurn} / ${commentary.maxTurns}`, 620, COMMENTARY_Y + 120);
    ctx.fillText(commentary.currentPhase, 620, COMMENTARY_Y + 105);
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
        this.addFloatingText(canvasWidth / 2, 200, "WINNER!", "#f1c40f", 48, true);
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
  }

  function resetBattleEffectState() {
    ensureBattleEffectState();
    matchAnimationState.effectBattle = null;
    matchAnimationState.effectEventIndex = -1;
    matchAnimationState.effectOutroBattle = null;
    commentary.lastDangerKey = "";
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
    commentary.bgTargetColor = commentaryBG.normal;
    if (titleScreenVisible) {
      commentary.line1.text = "RING DYNASTY";
      commentary.line2.text = "새 게임 또는 이어하기를 선택하세요";
      commentary.line1.color = "#ecf0f1";
      commentary.line2.color = "#f1c40f";
    } else {
      commentary.line1.text = "이번 주 카드를 준비하고 단체를 운영하세요";
      commentary.line2.text = pendingWeeklySummary ? "결산 대기 중입니다" : "서킷과 PPV를 향해 전진 중";
      commentary.line1.color = "#ecf0f1";
      commentary.line2.color = "#95a5a6";
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

  function applyDangerPulse(leftSnapshot, rightSnapshot) {
    const leftRatio = clamp(leftSnapshot.currentHP / leftSnapshot.maxHP, 0, 1);
    const rightRatio = clamp(rightSnapshot.currentHP / rightSnapshot.maxHP, 0, 1);
    if (leftRatio <= 0.3 || rightRatio <= 0.3) {
      const targetSide = leftRatio <= rightRatio ? "left" : "right";
      const dangerSnapshot = targetSide === "left" ? leftSnapshot : rightSnapshot;
      effectEngine.setDangerPulse(true, targetSide);
      const dangerKey = `${dangerSnapshot.id}:${Math.floor((dangerSnapshot.currentHP / dangerSnapshot.maxHP) * 100)}`;
      if (commentary.lastDangerKey !== dangerKey) {
        commentary.lastDangerKey = dangerKey;
        setCommentary("danger", {
          A: targetSide === "left" ? rightSnapshot.name : leftSnapshot.name,
          B: dangerSnapshot.name,
          DMG: "",
          FINISHER: ""
        }, "danger", "#ffcfbf", "#ff8f8f");
      }
    } else {
      effectEngine.setDangerPulse(false);
      commentary.lastDangerKey = "";
    }
  }

  function triggerBattleEventEffects(ctx, battlePackage, event, attackerX, attackerY, defenderX, defenderY) {
    ensureBattleEffectState();
    const eventIndex = battlePackage.battleEvents.indexOf(event);
    if (matchAnimationState.effectBattle === battlePackage && matchAnimationState.effectEventIndex === eventIndex) {
      return;
    }

    matchAnimationState.effectBattle = battlePackage;
    matchAnimationState.effectEventIndex = eventIndex;

    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
    const technicalColor = "#3498db";
    const maxTurns = Math.max(60, battlePackage.battleResult?.totalTurns || 60);
    const attackerName = event.attackerId === event.beforeLeft?.id ? event.beforeLeft?.name : event.beforeRight?.name;
    const defenderName = event.defenderId === event.beforeLeft?.id ? event.beforeLeft?.name : event.beforeRight?.name;
    const replacements = {
      A: attackerName || "",
      B: defenderName || "",
      DMG: String(event.damage || 0),
      FINISHER: event.moveName || ""
    };
    commentary.currentTurn = event.turn || 0;
    commentary.maxTurns = maxTurns;
    commentary.currentPhase = getCommentaryPhase(event.turn || 0, maxTurns);

    if (event.turn === Math.ceil(maxTurns * 0.4)) {
      setCommentary("phase_mid", replacements, "normal", "#d7e7ff", "#ecf0f1");
    } else if (event.turn === Math.ceil(maxTurns * 0.75)) {
      setCommentary("phase_climax", replacements, "critical", "#ffe6a8", "#f1c40f");
    }

    if (event.type === "miss") {
      if ((event.resultText || "").includes("DODGE")) {
        effectEngine.addFloatingText(defenderX, defenderY - 70, "DODGE!", technicalColor, 20, true);
        setCommentary("dodge", replacements, "normal", "#b8deff", "#7ed6ff");
      } else {
        effectEngine.addImpactRing(defenderX, defenderY - 28, "#7f8c8d", 30, 3);
        effectEngine.addFloatingText(defenderX, defenderY - 70, "BLOCK!", "#7f8c8d", 20, true);
        setCommentary("block", replacements, "normal", "#d0d7dc", "#95a5a6");
      }
      return;
    }

    if (event.type === "finisher-counter") {
      effectEngine.addPowerHit(attackerX, attackerY - 28);
      effectEngine.addFloatingText(attackerX, attackerY - 72, "COUNTER!", "#e74c3c", 24, true);
      effectEngine.addFloatingText(attackerX, attackerY - 40, `-${event.damage}`, "#ff9500", 26, true);
      setCommentary("finisher_miss", replacements, "power", "#ffd7c9", "#ff9b7a");
      return;
    }

    if (event.damage > 0) {
      if (event.type === "finisher") {
        effectEngine.addFinisher(defenderX, defenderY - 24, event.moveName, canvasWidth, canvasHeight);
        effectEngine.addFloatingText(defenderX, defenderY - 40, `-${event.damage}`, "#f1c40f", 32, true);
        setCommentary("finisher", replacements, "finisher", "#ecf0f1", "#f1c40f");
      } else if (event.isCrit) {
        effectEngine.addCriticalHit(defenderX, defenderY - 30);
        effectEngine.addFloatingText(defenderX, defenderY - 40, `CRIT! ${event.damage}`, "#f1c40f", 30, true);
        setCommentary("critical", replacements, "critical", "#ffe59a", "#f1c40f");
      } else if (event.moveType === "power") {
        effectEngine.addPowerHit(defenderX, defenderY - 28);
        effectEngine.addFloatingText(defenderX, defenderY - 36, `-${event.damage}`, "#ff9500", 26, true);
        setCommentary("power_attack", replacements, "power", "#ffd4c0", "#ff9500");
      } else if (event.moveType === "technical" || event.type === "submission") {
        effectEngine.addBasicHit(defenderX, defenderY - 30);
        effectEngine.addImpactRing(defenderX, defenderY - 30, technicalColor, 45, 4);
        effectEngine.addFloatingText(defenderX, defenderY - 36, `-${event.damage}`, technicalColor, 24, true);
        setCommentary("technical", replacements, "normal", "#d8ecff", technicalColor);
      } else {
        effectEngine.addBasicHit(defenderX, defenderY - 30);
        effectEngine.addFloatingText(defenderX, defenderY - 36, `-${event.damage}`, "#ffffff", 22, true);
        setCommentary("basic_attack", replacements, "normal", "#ecf0f1", "#ffffff");
      }
    }

    if (event.type === "pin" || event.type === "finisher") {
      effectEngine.addDown(defenderX, defenderY);
    }

    if (event.pinResult && event.pinResult.escapedAt > 0) {
      effectEngine.addImpactRing(defenderX, defenderY - 30, "#2ecc71", 38, 4);
      effectEngine.addFloatingText(defenderX, defenderY - 76, event.pinResult.pinText || "KICK OUT!", "#2ecc71", 22, true);
      setCommentary(
        event.pinResult.escapedAt >= 2 ? "pin_kickout_2" : "pin_kickout_1",
        replacements,
        "down",
        "#f8e8ff",
        "#2ecc71"
      );
    } else if (event.pinResult && event.pinResult.winner) {
      setCommentary("pin_success", replacements, "victory", "#d8ffe2", "#f1c40f");
    } else if (event.type === "pin") {
      setCommentary("pin_attempt", replacements, "down", "#f4deff", "#ecf0f1");
    } else if (event.type === "finisher") {
      setCommentary("down", replacements, "down", "#f4deff", "#ff9bb7");
    }

    if (event.moveType === "power" || event.moveType === "technical") {
      effectEngine.addFloatingText(attackerX, 188, `${event.moveName}!`, event.moveType === "technical" ? technicalColor : "#ffffff", event.moveType === "technical" ? 16 : 14, true);
    }

    if (event.type === "escape") {
      effectEngine.addFloatingText(attackerX, attackerY - 54, event.success ? "ESCAPE!" : "STOPPED!", event.success ? "#2ecc71" : "#e74c3c", 20, true);
      commentary.line1.text = event.actionText || `${replacements.A}가 탈출을 시도한다!`;
      commentary.line2.text = event.resultText || (event.success ? "탈출 성공!" : "저지당했다!");
      commentary.line1.color = "#ecf0f1";
      commentary.line2.color = event.success ? "#2ecc71" : "#e74c3c";
      commentary.bgTargetColor = commentaryBG.normal;
    } else if (event.type === "stunned") {
      effectEngine.addFloatingText(attackerX, attackerY - 54, "STUNNED", "#f39c12", 18, true);
      commentary.line1.text = event.actionText || `${replacements.A}는 기절 상태다!`;
      commentary.line2.text = event.resultText || "아무것도 하지 못했다.";
      commentary.line1.color = "#ffe0a8";
      commentary.line2.color = "#f39c12";
      commentary.bgTargetColor = commentaryBG.normal;
    } else if (event.type === "rest") {
      effectEngine.addFloatingText(attackerX, attackerY - 54, "RECOVER", "#2ecc71", 16, true);
      commentary.line1.text = event.actionText || `${replacements.A}가 숨을 고른다.`;
      commentary.line2.text = event.resultText || "스태미나를 회복했다.";
      commentary.line1.color = "#d8ffe2";
      commentary.line2.color = "#2ecc71";
      commentary.bgTargetColor = commentaryBG.normal;
    } else if (event.type === "time-limit") {
      effectEngine.addScreenFlash("#ffffff", 0.25, 220);
      effectEngine.addFloatingText(canvasWidth / 2, 110, "TIME LIMIT!", "#ffffff", 28, true);
      commentary.line1.text = "시간 제한 도달!";
      commentary.line2.text = event.resultText || "판정으로 승부가 갈린다!";
      commentary.line1.color = "#ecf0f1";
      commentary.line2.color = "#f1c40f";
      commentary.bgTargetColor = commentaryBG.critical;
    }

    if (event.hypeAfter >= 90) {
      const hypeColors = ["#e74c3c", "#3498db", "#f1c40f", "#2ecc71", "#ecf0f1"];
      for (let index = 0; index < 5; index += 1) {
        effectEngine.particles.push({
          type: "star",
          x: (canvasWidth / 2) + ((Math.random() - 0.5) * 140),
          y: 20 + ((Math.random() - 0.5) * 10),
          vx: (Math.random() - 0.5) * 1.5,
          vy: 0.3 + (Math.random() * 1.3),
          size: 2 + (Math.random() * 2),
          color: hypeColors[index],
          opacity: 0.95,
          decay: 0.02,
          gravity: 0.01,
          life: 26
        });
      }
    }
  }

  const originalStartMatchAnimation = startMatchAnimation;
  startMatchAnimation = function (matchQueue) {
    ensureBattleEffectState();
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

  drawBattleArena = function (ctx, hypeValue, frame, matchMode = true) {
    prepareSceneCanvas(ctx);
    ctx.fillStyle = "#0d0d0d";
    ctx.fillRect(0, 0, CANVAS_WIDTH, SCENE_HEIGHT);
    if (matchMode) {
      const hasRingArt = drawSceneImageCover(ctx, getBattleRingImagePath(), 0.96);
      if (hasRingArt) {
        ctx.fillStyle = "rgba(8, 10, 16, 0.18)";
        ctx.fillRect(0, 0, CANVAS_WIDTH, SCENE_HEIGHT);
      } else {
        drawCrowd(ctx, hypeValue, frame);
        ctx.strokeStyle = "#ecf0f1";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(40, 210);
        ctx.lineTo(600, 210);
        ctx.moveTo(40, 220);
        ctx.lineTo(600, 220);
        ctx.stroke();
        ctx.strokeStyle = "#8B4513";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(20, 230);
        ctx.lineTo(620, 230);
        ctx.stroke();
      }
    } else {
      const hasArenaArt = drawSceneImageCover(ctx, getStageArenaImagePath(), 0.72);
      if (hasArenaArt) {
        ctx.fillStyle = "rgba(8, 12, 20, 0.35)";
        ctx.fillRect(0, 0, CANVAS_WIDTH, SCENE_HEIGHT);
      }
      drawCrowd(ctx, hypeValue, frame);
      ctx.strokeStyle = "#ecf0f1";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(40, 210);
      ctx.lineTo(600, 210);
      ctx.moveTo(40, 220);
      ctx.lineTo(600, 220);
      ctx.stroke();
      ctx.strokeStyle = "#8B4513";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(20, 230);
      ctx.lineTo(620, 230);
      ctx.stroke();
    }
  };

  drawTitleScreenCanvas = function (ctx, now) {
    prepareSceneCanvas(ctx);
    ctx.fillStyle = "#0d0d0d";
    ctx.fillRect(0, 0, CANVAS_WIDTH, SCENE_HEIGHT);
    drawSceneImageCover(ctx, GENERATED_UI_ASSETS.panels.title, 0.82);
    drawSceneImageCover(ctx, getShowLogisticsPath(SHOW_LOGISTICS_ASSETS.title), 0.58);
    drawSceneImageCover(ctx, getShowLogisticsPath(SHOW_LOGISTICS_ASSETS.titleAccent), 0.18);
    ctx.fillStyle = "rgba(6, 10, 18, 0.48)";
    ctx.fillRect(0, 0, CANVAS_WIDTH, SCENE_HEIGHT);
    ctx.strokeStyle = "rgba(231, 76, 60, 0.45)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 190);
    ctx.lineTo(580, 190);
    ctx.moveTo(60, 212);
    ctx.lineTo(580, 212);
    ctx.stroke();
    for (let index = 0; index < 24; index += 1) {
      const x = 40 + (index * 25);
      const y = 40 + (Math.sin((now / 500) + index) * 8);
      ctx.fillStyle = index % 2 === 0 ? "rgba(241, 196, 15, 0.7)" : "rgba(236, 240, 241, 0.5)";
      ctx.fillRect(x, y, 3, 3);
    }
    drawCanvasImageContain(ctx, GENERATED_UI_ASSETS.logo, 100, 64, 440, 110, 1);
    ctx.fillStyle = "#ecf0f1";
    ctx.textAlign = "center";
    ctx.font = '14px "Courier New"';
    ctx.fillText("Build your promotion. Defend your legacy.", 320, 178);
  };

  drawIdleHomeCanvas = function (ctx) {
    drawBattleArena(ctx, gameState.hype, performance.now() / 16, false);
    drawHypeHeader(ctx, gameState.hype);
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(110, 150, 60, 90);
    ctx.fillRect(200, 125, 90, 115);
    ctx.fillRect(320, 110, 120, 130);
    ctx.fillRect(470, 145, 70, 95);
    ctx.fillStyle = "#ecf0f1";
    ctx.textAlign = "center";
    ctx.font = '20px "Courier New"';
    ctx.fillText(`Week ${gameState.week} - ${getHomeArenaLabel()}`, 320, 170);
    ctx.font = '12px "Courier New"';
    getHomeMatchPreviewLines().forEach((line, index) => {
      ctx.fillText(line, 320, 310 + (index * 18));
    });
  };

  drawBattleIntro = function (ctx, battlePackage, progress, frame) {
    drawBattleArena(ctx, gameState.hype, frame, true);
    drawHypeHeader(ctx, gameState.hype);
    const leftSnapshot = snapshotBattleState(battlePackage.leftState);
    const rightSnapshot = snapshotBattleState(battlePackage.rightState);
    const slideProgress = clamp(progress / 0.68, 0, 1);
    const leftX = -170 + (430 * slideProgress);
    const rightX = 810 - (430 * slideProgress);

    ctx.fillStyle = "rgba(3, 5, 10, 0.46)";
    ctx.fillRect(0, 0, CANVAS_WIDTH, SCENE_HEIGHT);
    drawSceneImageCover(ctx, "data/images/ui/panels/vs_overlay.png", 0.85);
    drawVersusPortrait(ctx, leftSnapshot, leftX, 342, 180, 244, false);
    drawVersusPortrait(ctx, rightSnapshot, rightX, 342, 180, 244, true);
    ctx.fillStyle = "#ecf0f1";
    ctx.font = '18px "Courier New"';
    ctx.textAlign = "center";
    ctx.fillText(leftSnapshot.name, 170, 330);
    ctx.fillText(rightSnapshot.name, 470, 330);
    ctx.font = '12px "Courier New"';
    ctx.fillStyle = "#bdc3c7";
    ctx.fillText(`"${leftSnapshot.nickname || ""}"`, 170, 352);
    ctx.fillText(`"${rightSnapshot.nickname || ""}"`, 470, 352);
    if (progress > 0.40) {
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#b42020";
      ctx.lineWidth = 3;
      ctx.font = '46px "Courier New"';
      ctx.strokeText("VS", 320, 196);
      ctx.fillText("VS", 320, 196);
    }
    if (progress > 0.78) {
      ctx.fillStyle = "#f1c40f";
      ctx.font = '30px "Courier New"';
      ctx.fillText("FIGHT!", 320, 122);
    }

    commentary.currentTurn = 0;
    commentary.maxTurns = Math.max(60, battlePackage.battleResult?.totalTurns || 60);
    commentary.currentPhase = "INTRO";
    commentary.line1.text = `${leftSnapshot.name} VS ${rightSnapshot.name}`;
    commentary.line2.text = "이번 경기의 운명이 곧 결정된다";
    commentary.line1.color = "#ecf0f1";
    commentary.line2.color = "#f1c40f";
    commentary.bgTargetColor = commentaryBG.normal;
    renderCommentary(ctx);
  };

  drawBattleEventFrame = function (ctx, battlePackage, event, progress, frame) {
    const leftSnapshot = progress < 0.5 ? event.beforeLeft : event.afterLeft;
    const rightSnapshot = progress < 0.5 ? event.beforeRight : event.afterRight;
    const hypeValue = event.hypeAfter;
    const attackerIsLeft = event.attackerId === leftSnapshot.id;

    drawBattleArena(ctx, hypeValue, frame, true);
    drawHypeHeader(ctx, hypeValue);
    drawBattleHpBar(ctx, 10, 10, 220, leftSnapshot, false);
    drawBattleHpBar(ctx, 410, 10, 220, rightSnapshot, true);
    drawBattleSubBar(ctx, 10, 30, 220, leftSnapshot.currentStamina, leftSnapshot.maxStamina, "#3498db");
    drawBattleSubBar(ctx, 410, 30, 220, rightSnapshot.currentStamina, rightSnapshot.maxStamina, "#3498db");
    drawBattleSubBar(ctx, 10, 42, 220, leftSnapshot.finisherGauge, 100, leftSnapshot.finisherGauge >= 100 ? "#e74c3c" : leftSnapshot.finisherGauge >= 50 ? "#9b59b6" : "#555", leftSnapshot.finisherGauge >= 100);
    drawBattleSubBar(ctx, 410, 42, 220, rightSnapshot.finisherGauge, 100, rightSnapshot.finisherGauge >= 100 ? "#e74c3c" : rightSnapshot.finisherGauge >= 50 ? "#9b59b6" : "#555", rightSnapshot.finisherGauge >= 100);
    drawMomentumBar(ctx, leftSnapshot, rightSnapshot);

    if (leftSnapshot.finisherGauge >= 100) {
      ctx.fillStyle = "#e74c3c";
      ctx.font = '9px "Courier New"';
      ctx.textAlign = "left";
      ctx.fillText("FINISHER READY!", 10, 58);
    }
    if (rightSnapshot.finisherGauge >= 100) {
      ctx.fillStyle = "#e74c3c";
      ctx.font = '9px "Courier New"';
      ctx.textAlign = "right";
      ctx.fillText("FINISHER READY!", 630, 58);
    }

    let leftX = 160;
    let rightX = 480;
    let leftY = 230;
    let rightY = 230;
    let leftState = leftSnapshot.isDown ? "down" : "idle";
    let rightState = rightSnapshot.isDown ? "down" : "idle";
    const swing = progress < 0.55 ? Math.sin(progress * Math.PI) * 24 : 0;

    if (event.type === "rest" || event.type === "stunned") {
      leftState = leftSnapshot.isDown ? "down" : "idle";
      rightState = rightSnapshot.isDown ? "down" : "idle";
    } else if (attackerIsLeft) {
      leftX += swing;
      leftState = event.type === "finisher" || event.moveType === "power" || event.moveType === "technical" ? "attack" : "walk";
      if (event.pinResult || rightSnapshot.isDown) {
        rightState = "down";
        rightY += 18;
      }
    } else {
      rightX -= swing;
      rightState = event.type === "finisher" || event.moveType === "power" || event.moveType === "technical" ? "attack" : "walk";
      if (event.pinResult || leftSnapshot.isDown) {
        leftState = "down";
        leftY += 18;
      }
    }

    if (leftSnapshot.finisherGauge >= 100) {
      effectEngine.addFinisherAura(leftX, leftY - 35);
    }
    if (rightSnapshot.finisherGauge >= 100) {
      effectEngine.addFinisherAura(rightX, rightY - 35);
    }

    applyDangerPulse(leftSnapshot, rightSnapshot);
    triggerBattleEventEffects(
      ctx,
      battlePackage,
      event,
      attackerIsLeft ? leftX : rightX,
      attackerIsLeft ? leftY : rightY,
      attackerIsLeft ? rightX : leftX,
      attackerIsLeft ? rightY : leftY
    );

    effectEngine.renderOverlays(ctx);

    ctx.save();
    ctx.translate(effectEngine.shakes.x, effectEngine.shakes.y);
    effectEngine.renderImpacts(ctx);
    drawBattleWrestler(ctx, leftSnapshot, leftX, leftY, frame, leftState, false);
    drawBattleWrestler(ctx, rightSnapshot, rightX, rightY, frame, rightState, true);
    effectEngine.renderParticles(ctx);
    effectEngine.renderOrbitStars(ctx);
    effectEngine.renderFloatingTexts(ctx);
    if (event.type === "pin" || event.type === "finisher") {
      ctx.fillStyle = "#e74c3c";
      ctx.font = '26px "Courier New"';
      ctx.textAlign = "center";
      ctx.fillText("DOWN!", 320, 145);
    }
    drawDebugOverlay(ctx, leftSnapshot, rightSnapshot, event);
    ctx.restore();

    if (event.type === "finisher") {
      ctx.fillStyle = "#e74c3c";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.font = '32px "Courier New"';
      ctx.textAlign = "center";
      ctx.strokeText(`${event.moveName}!!!`, 320 + (Math.sin(progress * 30) * 2), 170);
      ctx.fillText(`${event.moveName}!!!`, 320 + (Math.sin(progress * 30) * 2), 170);
    }
    renderPinCountText(ctx, event.pinResult, progress);
    effectEngine.renderDangerPulse(ctx);
    effectEngine.renderFlashes(ctx);

    const staminaWarning = attackerIsLeft
      ? getStaminaStateLabel(leftSnapshot.currentStamina)
      : getStaminaStateLabel(rightSnapshot.currentStamina);
    if (staminaWarning) {
      ctx.fillStyle = "#f1c40f";
      ctx.font = '16px "Courier New"';
      ctx.textAlign = "center";
      ctx.fillText(staminaWarning, 320, 190);
    }

    renderCommentary(ctx);
  };

  drawBattleOutro = function (ctx, battlePackage, progress, frame) {
    const lastEvent = battlePackage.battleEvents[battlePackage.battleEvents.length - 1];
    const leftSnapshot = lastEvent ? lastEvent.afterLeft : snapshotBattleState(battlePackage.leftState);
    const rightSnapshot = lastEvent ? lastEvent.afterRight : snapshotBattleState(battlePackage.rightState);
    const winnerId = battlePackage.battleResult.winnerId;
    const leftWin = winnerId === leftSnapshot.id;
    const winnerSnapshot = leftWin ? leftSnapshot : rightSnapshot;

    ensureBattleEffectState();
    if (matchAnimationState.effectOutroBattle !== battlePackage) {
      matchAnimationState.effectOutroBattle = battlePackage;
      effectEngine.addVictoryBurst(ctx.canvas.width, ctx.canvas.height);
      commentary.currentTurn = battlePackage.battleResult.totalTurns || 0;
      commentary.maxTurns = Math.max(60, battlePackage.battleResult.totalTurns || 60);
      commentary.currentPhase = "FINISH";
      commentary.line1.text = `${winnerSnapshot.name}가 마지막 순간을 장식한다!`;
      commentary.line2.text = `${winnerSnapshot.name} 승리!!! 경기 종료!!!`;
      commentary.line1.color = "#d8ffe2";
      commentary.line2.color = "#f1c40f";
      commentary.bgTargetColor = commentaryBG.victory;
    }

    drawBattleArena(ctx, clamp(gameState.hype + battlePackage.battleResult.hypeGenerated, 0, 100), frame, true);
    drawHypeHeader(ctx, clamp(gameState.hype + battlePackage.battleResult.hypeGenerated, 0, 100));
    drawBattleHpBar(ctx, 10, 10, 220, leftSnapshot, false);
    drawBattleHpBar(ctx, 410, 10, 220, rightSnapshot, true);
    drawBattleSubBar(ctx, 10, 30, 220, leftSnapshot.currentStamina, leftSnapshot.maxStamina, "#3498db");
    drawBattleSubBar(ctx, 410, 30, 220, rightSnapshot.currentStamina, rightSnapshot.maxStamina, "#3498db");
    drawBattleSubBar(ctx, 10, 42, 220, leftSnapshot.finisherGauge, 100, "#555");
    drawBattleSubBar(ctx, 410, 42, 220, rightSnapshot.finisherGauge, 100, "#555");
    drawMomentumBar(ctx, leftSnapshot, rightSnapshot);

    applyDangerPulse(leftSnapshot, rightSnapshot);
    effectEngine.renderOverlays(ctx);

    ctx.save();
    ctx.translate(effectEngine.shakes.x, effectEngine.shakes.y);
    effectEngine.renderImpacts(ctx);
    drawBattleWrestler(ctx, leftSnapshot, leftWin ? 200 : 430, leftWin ? 220 : 248, frame, leftWin ? "victory" : "down", false);
    drawBattleWrestler(ctx, rightSnapshot, leftWin ? 480 : 320, leftWin ? 248 : 220, frame, leftWin ? "down" : "victory", true);
    effectEngine.renderParticles(ctx);
    effectEngine.renderOrbitStars(ctx);
    effectEngine.renderFloatingTexts(ctx);
    ctx.restore();

    ctx.fillStyle = "#f1c40f";
    ctx.font = '28px "Courier New"';
    ctx.textAlign = "center";
    ctx.fillText(`${winnerSnapshot.name} 승리!`, 320, 140);
    if (battlePackage.battleResult.finishType !== "TIME_LIMIT") {
      ctx.fillStyle = "#ecf0f1";
      ctx.font = '14px "Courier New"';
      ctx.fillText(`${winnerSnapshot.finisher}으로 결정!`, 320, 165);
    }

    effectEngine.renderDangerPulse(ctx);
    effectEngine.renderFlashes(ctx);
    renderCommentary(ctx);
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

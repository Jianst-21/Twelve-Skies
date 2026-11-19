import test from "node:test";
import assert from "node:assert/strict";
import {
  celestialToCartesian,
  computeDomeConstellations,
  computeErgonomicConstellations,
  generateRealCatalogStarfield,
} from "../src/components/canvas/celestialMath.ts";
import { BRIGHT_STARS } from "../src/data/brightStars.ts";
import { CONSTELLATIONS } from "../src/data/constellations.ts";

function dist3(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

function norm3(v) {
  const len = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / len, v[1] / len, v[2] / len];
}

test("celestialToCartesian converts J2000 RA/Dec to Three.js celestial sphere coordinates", () => {
  const vernal = celestialToCartesian(0, 0, 45);
  assert.ok(Math.abs(vernal[0] - 45) < 1e-6);
  assert.ok(Math.abs(vernal[1]) < 1e-6);
  assert.ok(Math.abs(vernal[2]) < 1e-6);

  // Antares (Alpha Scorpii): RA 16h 29m 24s (16.4901h), Dec -26.432 deg at R=45
  const antares = celestialToCartesian(16.4901, -26.432, 45);
  assert.ok(Math.abs(antares[0] - -15.52) < 0.25, `Antares x=${antares[0]}`);
  assert.ok(Math.abs(antares[1] - -20.03) < 0.25, `Antares y=${antares[1]}`);
  assert.ok(Math.abs(antares[2] - 37.19) < 0.25, `Antares z=${antares[2]}`);

  // J2000 North Galactic Pole: RA 12h 51m 26s (12.8573h), Dec +27.128 deg
  const ngp = celestialToCartesian(12.8573, 27.128, 1);
  assert.ok(Math.abs(ngp[0] - -0.868) < 0.01, `NGP x=${ngp[0]}`);
  assert.ok(Math.abs(ngp[1] - 0.456) < 0.01, `NGP y=${ngp[1]}`);
  assert.ok(Math.abs(ngp[2] - 0.197) < 0.01, `NGP z=${ngp[2]}`);
});

test("computeErgonomicConstellations enforces comfortable spacing while preserving shapes & sky sectors", () => {
  const minIntra = 4.8;
  const minInter = 7.5;
  const sphereRadius = 45;

  const relaxed = computeErgonomicConstellations(CONSTELLATIONS, {
    minIntraDistance: minIntra,
    minInterDistance: minInter,
    sphereRadius,
  });

  assert.equal(relaxed.length, CONSTELLATIONS.length);

  for (let cIdx = 0; cIdx < relaxed.length; cIdx++) {
    const orig = CONSTELLATIONS[cIdx];
    const next = relaxed[cIdx];

    assert.equal(next.id, orig.id);
    assert.equal(next.nodes.length, orig.nodes.length);
    assert.deepEqual(next.lines, orig.lines);

    // Every node stays on the celestial sphere surface
    for (const node of next.nodes) {
      const r = Math.hypot(node[0], node[1], node[2]);
      assert.ok(
        Math.abs(r - sphereRadius) < 0.05,
        `${next.id} node radius ${r} drifted from ${sphereRadius}`
      );
    }

    // Center stays within 12 degrees of its real astronomical sky sector
    const origDir = norm3(orig.center);
    const nextDir = norm3(next.center);
    const dot = Math.min(1, Math.max(-1, origDir[0] * nextDir[0] + origDir[1] * nextDir[1] + origDir[2] * nextDir[2]));
    const angleDeg = (Math.acos(dot) * 180) / Math.PI;
    assert.ok(
      angleDeg < 12,
      `${next.id} center drifted by ${angleDeg.toFixed(2)} deg`
    );

    // Intra-constellation minimum node spacing
    for (let i = 0; i < next.nodes.length; i++) {
      for (let j = i + 1; j < next.nodes.length; j++) {
        const d = dist3(next.nodes[i], next.nodes[j]);
        assert.ok(
          d >= minIntra - 0.05,
          `${next.id} nodes ${i}-${j} too close: ${d.toFixed(2)} < ${minIntra}`
        );
      }
    }
  }

  // Inter-constellation minimum node spacing
  for (let a = 0; a < relaxed.length; a++) {
    for (let b = a + 1; b < relaxed.length; b++) {
      for (let i = 0; i < relaxed[a].nodes.length; i++) {
        for (let j = 0; j < relaxed[b].nodes.length; j++) {
          const d = dist3(relaxed[a].nodes[i], relaxed[b].nodes[j]);
          assert.ok(
            d >= minInter - 0.05,
            `${relaxed[a].id}[${i}] and ${relaxed[b].id}[${j}] too close: ${d.toFixed(2)} < ${minInter}`
          );
        }
      }
    }
  }
});

test("generateRealCatalogStarfield maps real J2000 bright stars with realistic magnitudes and spectral colors", () => {
  assert.ok(BRIGHT_STARS.length >= 120, `Expected >=120 real bright stars, got ${BRIGHT_STARS.length}`);

  const fillerCount = 1500;
  const buffers = generateRealCatalogStarfield(BRIGHT_STARS, fillerCount, 90, 120, 12026);
  const totalCount = BRIGHT_STARS.length + fillerCount;

  assert.equal(buffers.positions.length, totalCount * 3);
  assert.equal(buffers.colors.length, totalCount * 3);
  assert.equal(buffers.sizes.length, totalCount);
  assert.equal(buffers.phases.length, totalCount);

  // Sirius (index 0 in catalog) should be brighter/larger than faint field stars
  const siriusIdx = BRIGHT_STARS.findIndex((s) => s.name === "Sirius");
  const betelgeuseIdx = BRIGHT_STARS.findIndex((s) => s.name === "Betelgeuse");
  assert.ok(siriusIdx >= 0, "Sirius must be in BRIGHT_STARS");
  assert.ok(betelgeuseIdx >= 0, "Betelgeuse must be in BRIGHT_STARS");

  const siriusSize = buffers.sizes[siriusIdx];
  const avgFieldSize =
    buffers.sizes
      .slice(BRIGHT_STARS.length, BRIGHT_STARS.length + 200)
      .reduce((acc, s) => acc + s, 0) / 200;
  assert.ok(siriusSize > avgFieldSize * 1.8, `Sirius size ${siriusSize} should stand out over field avg ${avgFieldSize}`);

  // Spectral color check: Betelgeuse (M-type red-orange) has red > blue; Sirius (A-type blue-white) has blue >= red
  const betelR = buffers.colors[betelgeuseIdx * 3];
  const betelB = buffers.colors[betelgeuseIdx * 3 + 2];
  assert.ok(betelR > betelB * 1.25, `Betelgeuse should be warm orange-red (R=${betelR}, B=${betelB})`);

  const siriusR = buffers.colors[siriusIdx * 3];
  const siriusB = buffers.colors[siriusIdx * 3 + 2];
  assert.ok(siriusB >= siriusR, `Sirius should be crisp blue-white (R=${siriusR}, B=${siriusB})`);
});

test("computeDomeConstellations spreads all 12 constellations across upper, mid, and lower dome wave", () => {
  const sphereRadius = 52;
  const minIntra = 4.8;
  const minInter = 16.0;

  const dome = computeDomeConstellations(CONSTELLATIONS, {
    sphereRadius,
    waveElevationDeg: 46,
    minIntraDistance: minIntra,
  });

  assert.equal(dome.length, CONSTELLATIONS.length);

  let upperCount = 0;
  let midCount = 0;
  let lowerCount = 0;

  for (let cIdx = 0; cIdx < dome.length; cIdx++) {
    const orig = CONSTELLATIONS[cIdx];
    const next = dome[cIdx];

    assert.equal(next.id, orig.id);
    assert.equal(next.nodes.length, orig.nodes.length);
    assert.deepEqual(next.lines, orig.lines);

    const centerR = Math.hypot(next.center[0], next.center[1], next.center[2]);
    assert.ok(Math.abs(centerR - sphereRadius) < 0.1, `${next.id} center radius=${centerR}`);

    const elevDeg = (Math.asin(Math.max(-1, Math.min(1, next.center[1] / centerR))) * 180) / Math.PI;
    if (elevDeg >= 38) upperCount++;
    else if (elevDeg <= -38) lowerCount++;
    else if (Math.abs(elevDeg) <= 8) midCount++;

    // Every star node sits cleanly on sphere surface
    for (const node of next.nodes) {
      const r = Math.hypot(node[0], node[1], node[2]);
      assert.ok(
        Math.abs(r - sphereRadius) < 0.08,
        `${next.id} node radius ${r} != ${sphereRadius}`
      );
    }

    // Intra-constellation minimum node spacing
    for (let i = 0; i < next.nodes.length; i++) {
      for (let j = i + 1; j < next.nodes.length; j++) {
        const d = dist3(next.nodes[i], next.nodes[j]);
        assert.ok(
          d >= minIntra - 0.05,
          `${next.id} nodes ${i}-${j} too close: ${d.toFixed(2)} < ${minIntra}`
        );
      }
    }
  }

  // Must genuinely form a 3D dome across upper, equatorial, and lower latitudes
  assert.equal(upperCount, 3, `Expected 3 upper-dome constellations, got ${upperCount}`);
  assert.equal(midCount, 6, `Expected 6 equatorial-dome constellations, got ${midCount}`);
  assert.equal(lowerCount, 3, `Expected 3 lower-dome constellations, got ${lowerCount}`);

  // Wide center-to-center angular separation (>= 50 deg) and node-to-node separation (>= 16 units)
  for (let a = 0; a < dome.length; a++) {
    for (let b = a + 1; b < dome.length; b++) {
      const dirA = norm3(dome[a].center);
      const dirB = norm3(dome[b].center);
      const dot = Math.min(1, Math.max(-1, dirA[0] * dirB[0] + dirA[1] * dirB[1] + dirA[2] * dirB[2]));
      const angleDeg = (Math.acos(dot) * 180) / Math.PI;
      assert.ok(
        angleDeg >= 50,
        `${dome[a].id}-${dome[b].id} center separation ${angleDeg.toFixed(1)} deg < 50 deg`
      );

      for (let i = 0; i < dome[a].nodes.length; i++) {
        for (let j = 0; j < dome[b].nodes.length; j++) {
          const d = dist3(dome[a].nodes[i], dome[b].nodes[j]);
          assert.ok(
            d >= minInter,
            `${dome[a].id}[${i}] and ${dome[b].id}[${j}] too close: ${d.toFixed(2)} < ${minInter}`
          );
        }
      }
    }
  }
});

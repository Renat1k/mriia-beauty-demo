import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

type Kind = 'hero' | 'hair' | 'nails' | 'brows' | 'flower'

// A real, locally rendered clay still life. No remote illustration or image service.
export default function ClayScene({ kind = 'hero', className = '' }: { kind?: Kind; className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true })
    } catch {
      host.classList.add('clay-fallback')
      return
    }
    const styles = getComputedStyle(document.documentElement)
    const color = (token: string) => styles.getPropertyValue(`--${token}`).trim()
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.3
    host.appendChild(renderer.domElement)
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(kind === 'hero' ? 31 : 34, 1, 0.1, 80)
    camera.position.set(kind === 'hero' ? 6.2 : 3.4, kind === 'hero' ? 4.8 : 2.9, kind === 'hero' ? 9.2 : 5.4)
    camera.lookAt(0, kind === 'hero' ? 1.65 : 1.25, 0)
    scene.add(new THREE.AmbientLight(color('canvas'), 2.4))
    const light = new THREE.DirectionalLight(color('on-primary'), 4)
    light.position.set(-4, 8, 6)
    light.castShadow = true
    light.shadow.mapSize.set(1024, 1024)
    light.shadow.camera.left = -7
    light.shadow.camera.right = 7
    light.shadow.camera.top = 7
    light.shadow.camera.bottom = -7
    light.shadow.normalBias = 0.03
    light.shadow.radius = 7
    scene.add(light)
    const fill = new THREE.DirectionalLight(color('brand-peach'), 1.5)
    fill.position.set(5, 3, -3)
    scene.add(fill)

    const material = (token: string) => new THREE.MeshStandardMaterial({ color: color(token), roughness: 0.78, metalness: 0.01 })
    const mats = {
      pink: material('brand-pink'), lavender: material('brand-lavender'), mint: material('brand-mint'),
      cream: material('surface-strong'), peach: material('brand-peach'), ochre: material('brand-ochre'),
      teal: material('brand-teal'), white: material('canvas'), coral: material('brand-coral'),
    }
    const root = new THREE.Group()
    scene.add(root)
    const mesh = (geometry: THREE.BufferGeometry, mat: THREE.Material, parent: THREE.Object3D = root) => {
      const object = new THREE.Mesh(geometry, mat)
      object.castShadow = true
      object.receiveShadow = true
      parent.add(object)
      return object
    }
    const rounded = (w: number, h: number, d: number, r: number, mat: THREE.Material, x: number, y: number, z: number, parent = root) => {
      const object = mesh(new RoundedBoxGeometry(w, h, d, 5, r), mat, parent)
      object.position.set(x, y, z)
      return object
    }
    const sphere = (r: number, mat: THREE.Material, x: number, y: number, z: number, parent = root) => {
      const object = mesh(new THREE.SphereGeometry(r, 40, 28), mat, parent)
      object.position.set(x, y, z)
      return object
    }
    const cylinder = (r: number, h: number, mat: THREE.Material, x: number, y: number, z: number, parent = root) => {
      const object = mesh(new THREE.CylinderGeometry(r, r, h, 64, 1, false), mat, parent)
      object.position.set(x, y, z)
      return object
    }
    const bottle = (x: number, z: number, size: number, mat: THREE.Material, pump = false, base = 0.28) => {
      const group = new THREE.Group()
      root.add(group)
      group.position.set(x, base, z)
      const points = [[0, 0], [0.39, 0], [0.48, 0.08], [0.49, 0.2], [0.49, 1.28], [0.45, 1.42], [0.23, 1.54], [0.22, 1.7], [0, 1.7]]
      mesh(new THREE.LatheGeometry(points.map(([px, py]) => new THREE.Vector2(px * size, py * size)), 64), mat, group)
      cylinder(0.235 * size, 0.22 * size, pump ? mats.teal : mats.cream, 0, 1.77 * size, 0, group)
      if (pump) {
        cylinder(0.07 * size, 0.2 * size, mats.teal, 0, 1.95 * size, 0, group)
        rounded(0.65 * size, 0.14 * size, 0.18 * size, 0.06 * size, mats.teal, 0.14 * size, 2.07 * size, 0, group)
      }
      rounded(0.54 * size, 0.61 * size, 0.028, 0.07 * size, mats.white, 0.05 * size, 0.86 * size, 0.502 * size, group)
      const label = document.createElement('canvas')
      label.width = 256
      label.height = 256
      const ctx = label.getContext('2d')!
      ctx.fillStyle = color('brand-teal')
      ctx.textAlign = 'center'
      ctx.font = '500 57px sans-serif'
      ctx.fillText('мрія', 128, 117)
      ctx.font = '16px sans-serif'
      ctx.fillText('час для себе', 128, 155)
      const texture = new THREE.CanvasTexture(label)
      texture.colorSpace = THREE.SRGBColorSpace
      const labelMat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false })
      const labelMesh = mesh(new THREE.PlaneGeometry(0.5 * size, 0.5 * size), labelMat, group)
      labelMesh.position.set(0.05 * size, 0.86 * size, 0.523 * size)
      return group
    }
    const flower = (x: number, y: number, z: number, size: number, petalMat = mats.ochre) => {
      const group = new THREE.Group()
      root.add(group)
      group.position.set(x, y, z)
      group.rotation.set(-0.08, 0.3, -0.13)
      for (let i = 0; i < 8; i++) {
        const angle = i * Math.PI / 4
        const petal = sphere(0.36 * size, petalMat, Math.cos(angle) * 0.48 * size, Math.sin(angle) * 0.48 * size, 0, group)
        petal.scale.set(0.75, 1.3, 0.58)
        petal.rotation.z = angle - Math.PI / 2
      }
      sphere(0.29 * size, mats.peach, 0, 0, 0.19 * size, group).scale.z = 0.6
      return group
    }
    const comb = (x: number, y: number, z: number, size: number, mat = mats.peach) => {
      const group = new THREE.Group()
      root.add(group)
      group.position.set(x, y, z)
      group.rotation.set(-0.13, -0.2, -0.25)
      rounded(1.3 * size, 0.34 * size, 0.22 * size, 0.1 * size, mat, 0, 0, 0, group)
      for (let i = 0; i < 8; i++) rounded(0.09 * size, 0.66 * size, 0.2 * size, 0.045 * size, mat, (-0.52 + i * 0.15) * size, -0.33 * size, 0, group)
      return group
    }
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: 0.13 }))
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -0.04
    floor.receiveShadow = true
    scene.add(floor)

    if (kind === 'hero') {
      cylinder(2.35, 0.26, mats.cream, 0, 0.13, 0)
      cylinder(1.12, 0.58, mats.white, -0.67, 0.55, -0.48)
      // Sculpted mint arch with an inset muted mirror.
      const arch = new THREE.Shape()
      arch.moveTo(-1, 0)
      arch.lineTo(-1, 1.8)
      arch.absarc(0, 1.8, 1, Math.PI, 0, true)
      arch.lineTo(1, 0)
      arch.lineTo(-1, 0)
      const archMesh = mesh(new THREE.ExtrudeGeometry(arch, { depth: 0.25, bevelEnabled: true, bevelSegments: 6, steps: 1, bevelSize: 0.12, bevelThickness: 0.12, curveSegments: 48 }), mats.mint)
      archMesh.position.set(-0.88, 0.72, -0.9)
      archMesh.rotation.y = 0.15
      const inner = new THREE.Shape()
      inner.moveTo(-0.78, 0)
      inner.lineTo(-0.78, 1.57)
      inner.absarc(0, 1.57, 0.78, Math.PI, 0, true)
      inner.lineTo(0.78, 0)
      inner.lineTo(-0.78, 0)
      const mirror = mesh(new THREE.ShapeGeometry(inner, 48), new THREE.MeshStandardMaterial({ color: color('surface-card'), roughness: 0.25, metalness: 0.25 }))
      mirror.position.set(-0.84, 0.9, -0.48)
      mirror.rotation.y = 0.15
      bottle(0.25, 0.15, 1.26, mats.lavender, true)
      const pinkBottle = bottle(1.35, 0.72, 0.83, mats.pink)
      pinkBottle.rotation.z = -0.13
      cylinder(0.53, 0.36, mats.peach, -0.65, 0.47, 1.05)
      cylinder(0.56, 0.13, mats.coral, -0.65, 0.71, 1.05)
      flower(-1.65, 2.32, -0.1, 1.03)
      const stem = cylinder(0.065, 1.85, mats.teal, -1.65, 1.24, -0.17)
      stem.rotation.z = -0.05
      const leaf = sphere(0.4, mats.mint, -1.38, 1.23, -0.12)
      leaf.scale.set(1, 0.35, 0.33)
      leaf.rotation.z = 0.4
      comb(0.1, 0.64, 1.65, 0.85)
      sphere(0.23, mats.ochre, 1.68, 0.49, -0.5)
      sphere(0.2, mats.lavender, -1.96, 0.44, 0.63)
      root.rotation.y = -0.13
    } else if (kind === 'hair') {
      bottle(-0.58, -0.25, 1.25, mats.peach, true, 0.05)
      comb(0.78, 1.05, 0.65, 1.35, mats.ochre).rotation.z = -0.4
      sphere(0.24, mats.lavender, 0.62, 0.25, -0.1)
      root.rotation.y = -0.2
    } else if (kind === 'nails') {
      const polish = (x: number, z: number, mat: THREE.Material, scale: number) => {
        const group = new THREE.Group()
        root.add(group)
        group.position.set(x, 0.02, z)
        group.scale.setScalar(scale)
        rounded(0.95, 1.05, 0.8, 0.2, mat, 0, 0.53, 0, group)
        cylinder(0.28, 1.05, mats.lavender, 0, 1.56, 0, group)
        return group
      }
      polish(-0.55, 0, mats.pink, 1.2).rotation.z = -0.13
      polish(0.7, 0.55, mats.peach, 0.86).rotation.z = 0.12
      flower(0.72, 0.5, -0.7, 0.7, mats.lavender)
    } else if (kind === 'brows') {
      const mirror = new THREE.Group()
      root.add(mirror)
      mirror.rotation.set(-0.1, -0.2, -0.2)
      cylinder(0.1, 1.1, mats.ochre, -0.25, 0.55, 0, mirror)
      const frame = mesh(new THREE.TorusGeometry(0.8, 0.13, 24, 64), mats.peach, mirror)
      frame.position.set(-0.25, 1.85, 0)
      const glass = mesh(new THREE.CircleGeometry(0.78, 64), mats.cream, mirror)
      glass.position.set(-0.25, 1.85, -0.025)
      const brush = cylinder(0.09, 1.7, mats.teal, 0.95, 1, 0.4)
      brush.rotation.z = -0.35
      const tip = sphere(0.19, mats.pink, 1.24, 1.89, 0.4)
      tip.scale.set(0.8, 1.5, 0.8)
      tip.rotation.z = -0.35
      sphere(0.27, mats.peach, -0.85, 0.28, 0.6)
    } else {
      flower(0, 1.45, 0, 1.65, mats.pink)
      cylinder(0.1, 1.6, mats.teal, 0, 0.5, -0.12)
      const leaf = sphere(0.6, mats.mint, 0.45, 0.7, -0.1)
      leaf.scale.set(1, 0.35, 0.35)
      leaf.rotation.z = 0.4
      root.rotation.y = -0.3
    }

    let stopped = false
    const render = () => {
      if (stopped) return
      const { width, height } = host.getBoundingClientRect()
      if (!width || !height) return
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.render(scene, camera)
    }
    const observer = new ResizeObserver(render)
    observer.observe(host)
    render()
    return () => {
      stopped = true
      observer.disconnect()
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          const materials = Array.isArray(object.material) ? object.material : [object.material]
          materials.forEach((mat: THREE.Material & { map?: THREE.Texture | null }) => { mat.map?.dispose(); mat.dispose() })
        }
      })
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
    }
  }, [kind])

  return <div ref={hostRef} className={`clay-scene ${className}`} role="img" aria-label="Об’ємна композиція з квітів та косметики у фірмових кольорах мрії"><span className="clay-fallback-flower" aria-hidden="true">✿</span></div>
}

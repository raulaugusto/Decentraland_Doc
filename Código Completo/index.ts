// We define the empty imports so the auto-complete feature works as expected.
import { Vector3 } from '@dcl/sdk/math'
import { GltfContainer, InputAction, Transform, engine, pointerEventsSystem } from '@dcl/sdk/ecs'
import * as utils from '@dcl-sdk/utils'

import { changeColorSystem, circularSystem } from './systems'
import { setupUi } from './ui'
import { Spinner } from './components'

export function main() {
  engine.addSystem(circularSystem)
  engine.addSystem(changeColorSystem)

  // Crie uma variável que guardará uma nova entidade
  let avocado = engine.addEntity()

  // Relacione o modelo que instalamos no projeto com a entidade criada
  GltfContainer.create(avocado, {
    src: 'models/avocado.glb'
  })

  // Posicione o modelo na cena usando Vector3 para posição e escala
  Transform.create(avocado, {
    //position define onde no ambiente a entidade será posicionada
    position: Vector3.create(8, 0, 8),
    //scale define o tamanho da entidade relativo ao tamanho do modelo
    scale: Vector3.create(1.5, 1.5, 1.5)
  })

  // Usado para previnir que vários modelos sejam criados
  let avocadoCount = 0

  // Define uma interação com uma entidade, nesse caso, o clique com o botão esquerdo do mouse
  pointerEventsSystem.onPointerDown(
    {
      entity: avocado,
      opts: { button: InputAction.IA_POINTER, hoverText: 'Criar Novo' }
    },
    function () {
      if (avocadoCount == 0) {
        // Crie uma nova entidade
        let newAvocado = engine.addEntity()

        GltfContainer.create(newAvocado, {
          src: 'models/avocado.glb'
        })

        Transform.create(newAvocado, {
          position: Vector3.create(10, 0, 8),
          scale: Vector3.create(1, 1, 1)
        })

        // Adiciona o sistema de movimento circular à entidade, podendo selecionar a velocidade
        Spinner.create(newAvocado, { speed: 20 })

        // Aqui criaremos um evento que remove a entidade criada ao clicar sobre ela
        pointerEventsSystem.onPointerDown(
          {
            entity: newAvocado,
            opts: { button: InputAction.IA_POINTER, hoverText: 'Remover' }
          },
          function () {
            // Importamos import * as utils from '@dcl-sdk/utils'
            // Usaremos a função startScaling para fazer a animação da entidade diminuindo em tamanho
            utils.tweens.startScaling(
              newAvocado,
              Vector3.create(1, 1, 1),
              Vector3.create(0.1, 0.1, 0.1),
              0.2,
              utils.InterpolationType.EASEBOUNCE,
              // Após a animação removeremos a entidade com engine.removeEntity(newAvocado)
              () => {
                engine.removeEntity(newAvocado)
                avocadoCount = 0
              }
            )
          }
        )

        avocadoCount++
      }
    }
  )
  setupUi()
}

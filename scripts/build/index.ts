import consola from 'consola'
import { fullBuilder } from './full'
import { moduleBuilder } from './modules'

const task = [moduleBuilder(), fullBuilder(), fullBuilder(true)]

Promise.all(task).then(async () => {
  consola.success('✅ build completed')
})

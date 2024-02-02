import { addAlias } from 'module-alias'
import { resolve } from 'patch'

addAlias('@', resolve('dist'))

import path from 'path'
import { mkdir, readFile, writeFile } from 'fs/promises'
import consola from 'consola'
import glob from 'fast-glob'
import chalk from 'chalk'
import { Project } from 'ts-morph'
import type { CompilerOptions, SourceFile } from 'ts-morph'
import { projRoot, pkgRoot, typesOutDir, pathRewriter, excludeFiles } from './common'

const TSCONFIG_PATH = path.resolve(projRoot, 'tsconfig.app.json')
const outDir = typesOutDir

async function addSourceFiles(project: Project) {
  try {
    const globSourceFile = '**/*.{js?(x),ts?(x)}'

    const epPaths = excludeFiles(
      await glob(globSourceFile, {
        cwd: pkgRoot,
        onlyFiles: true
      })
    )

    const sourceFiles: SourceFile[] = []
    await Promise.all([
      ...epPaths.map(async file => {
        const content = await readFile(path.resolve(pkgRoot, file), 'utf-8')
        sourceFiles.push(project.createSourceFile(path.resolve('./', file), content))
      })
    ])

    return sourceFiles
  } catch (error: unknown) {
    throw new Error((error as Error).message || 'AddSourceFiles Error')
  }
}

function typeCheck(project: Project) {
  const diagnostics = project.getPreEmitDiagnostics()
  if (diagnostics.length > 0) {
    consola.error(project.formatDiagnosticsWithColorAndContext(diagnostics))
    const err = new Error('Failed to generate dts.')
    consola.error(err)
    throw err
  }
}

export const dts = async () => {
  try {
    const compilerOptions: CompilerOptions = {
      emitDeclarationOnly: true,
      outDir,
      baseUrl: projRoot,
      preserveSymlinks: true,
      skipLibCheck: true,
      noImplicitAny: false
    }
    const project = new Project({
      compilerOptions,
      tsConfigFilePath: TSCONFIG_PATH,
      skipAddingFilesFromTsConfig: true
    })

    const sourceFiles = await addSourceFiles(project)
    consola.success('Added source files')

    consola.start('Type checking...')
    typeCheck(project)
    consola.success('Type check passed!')

    consola.start('Type emitting...')
    await project.emit({
      emitOnlyDtsFiles: true
    })

    const tasks = sourceFiles.map(async sourceFile => {
      const relativePath = path.relative(pkgRoot, sourceFile.getFilePath())

      const emitOutput = sourceFile.getEmitOutput()
      const emitFiles = emitOutput.getOutputFiles()

      if (emitFiles.length === 0) {
        throw new Error(`Emit no file: ${chalk.bold(relativePath)}`)
      }

      const subTasks = emitFiles.map(async outputFile => {
        const filepath = outputFile.getFilePath()
        await mkdir(path.dirname(filepath), {
          recursive: true
        })

        await writeFile(filepath, pathRewriter(outputFile.getText()), 'utf8')
      })

      await Promise.all(subTasks)
    })

    await Promise.all(tasks)
    consola.success('Successfully generated definition for file!')
  } catch (error: unknown) {
    throw new Error((error as Error).message || 'Generated Definition Error')
  }
}

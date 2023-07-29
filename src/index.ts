import path from 'path'
import * as swc from '@swc/core'
import * as ts from "typescript";
import { getTsconfig as getTSconfig } from 'get-tsconfig';
import { typescriptParser } from "./ts";
import { swcParser } from './swc';
import { esbuildParser } from './esbuild';

const configPath = path.resolve(__dirname, '../payload.config.ts')

const start = async () => {
  switch (process.argv[2]) {
    case 'ts': {
      const tsConfig = getTSconfig()
      typescriptParser(configPath, tsConfig.config.compilerOptions as unknown as ts.CompilerOptions)
    }

    case 'swc': {
      await swcParser(configPath)
    }

    case 'esbuild': {
      await esbuildParser(configPath, 'admin')
    }
  }

}

start()


import cac from 'cac'
const cli = cac('detect-env')

cli
  .command('lint <dir>', 'Remove a dir')
  .option('-r, --recursive', 'Remove recursively')
  .action((dir, options) => {
    console.log('remove ' + dir + (options.recursive ? ' recursively' : ''))
  })

cli.help()

cli.parse()

const parsed = cli.parse()

console.log(JSON.stringify(parsed, null, 2))

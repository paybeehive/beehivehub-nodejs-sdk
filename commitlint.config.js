module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // Nova funcionalidade
        'fix',      // Correção de bug
        'docs',     // Mudanças na documentação
        'style',    // Formatação, ponto e vírgula, etc
        'refactor', // Refatoração de código
        'perf',     // Melhoria de performance
        'test',     // Adição ou correção de testes
        'chore',    // Manutenção, dependências, etc
        'revert',   // Reverter commit anterior
        'ci',       // Mudanças em CI/CD
        'build',    // Mudanças no sistema de build
      ],
    ],
    'subject-case': [0], // Permite qualquer case no subject
  },
};

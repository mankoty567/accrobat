const challengeValidation = require('../../modules/challengeValidation');

module.exports = {
  description: 'Test si la fonction de vérification de challenge marche bien',
  test: async (test) => {
    const fixture = require('../loadDataToBdd');

    let bonId = await fixture.bonChallenge();
    let pasBonId = await fixture.pasBonChallenge();

    let result1 = await challengeValidation(bonId);
    test.assertTrue(result1.valid, 'Bon Challenge Validation');

    let result2 = await challengeValidation(pasBonId);
    test.assertFalse(result2.valid, 'Mauvais Challenge Validation');

    test.assertEquals(7, result2.error.length, 'Tableau Error Longueur');
  },
};

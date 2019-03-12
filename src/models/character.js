const RandomizationService = require('../services/randomization-service');
const SkillType = require('../typings/skill-type');

module.exports = class Character {
  // character name
  name;

  // stats ranges
  healthRange;
  strengthRange;
  defenseRange;
  speedRange;
  luckRange;

  // stats
  health;
  strength;
  defense;
  speed;
  luck;

  // list of skills
  skills = [];

  /**
   * Define a new character
   * @param name character's name
   * @param statsRanges min and max values for character's stats
   * @param skillClasses available skills
   */
  constructor(name, statsRanges, skillClasses = []) {
    this.name = name;
    this.healthRange = statsRanges.healthRange;
    this.strengthRange = statsRanges.strengthRange;
    this.defenseRange = statsRanges.defenseRange;
    this.speedRange = statsRanges.speedRange;
    this.luckRange = statsRanges.luckRange;

    // initialize skills
    this.skills = skillClasses.map((skillClass) => new skillClass());
  }

  /**
   * Initialize the stats of a character
   */
  prepareForFight() {
    // (re)initialize stats
    this.health = RandomizationService.getRandomInRange(this.healthRange);
    this.strength = RandomizationService.getRandomInRange(this.strengthRange);
    this.defense = RandomizationService.getRandomInRange(this.defenseRange);
    this.speed = RandomizationService.getRandomInRange(this.speedRange);
    this.luck = RandomizationService.getRandomInRange(this.luckRange);
  }

  /**
   * Check if the character is lucky, based on its 'luck' property
   * @returns {boolean} true if the character is lucky, otherwise false
   */
  isLucky() {
    return RandomizationService.isLucky(this.luck);
  }

  /**
   * Attack a character
   * @param {Character} defender the character being attacked
   * @returns {number} damage caused by the attacker
   */
  attack(defender) {
    if (this.strength <= defender.defense) {
      // defender is too strong
      return 0;
    }

    // get usual damage
    let damage = this.strength - defender.defense;

    // use all attacking skills
    this.skills
      .filter((skill) => skill.type === SkillType.ATTACK)
      .forEach((skill) => {
        // keep the new damage
        damage = skill.use(this, damage);
      });

    return damage;
  }

  /**
   * Defend from a character's attack
   * @param {number} damage the damage caused by the attacker
   */
  defend(damage) {
    // check if character is lucky and can avoid the attack
    if (this.isLucky()) {
      // avoided the attack
      return;
    }

    // #TODO use defensive skills

    // get hit
    this.health = Math.max(0, (this.health - damage));
  }
};

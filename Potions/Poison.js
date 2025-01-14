class Poison {
    constructor(props) {
      this._id = props._id;
      this.description = props.description;
      this.image = props.image;
      this.type = props.type;
      this.name = props.name;
      this.value = props.value;
      this.modifiers = props.modifiers;
    }
  }
  
  module.exports = Poison;
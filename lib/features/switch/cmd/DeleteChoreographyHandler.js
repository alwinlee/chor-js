/**
 * Handler which deletes the currently displayed choreography.
 */
export default class DeleteChoreographyHandler {

  constructor(commandStack, choreoUtil) {
    this._commandStack = commandStack;
    this._choreoUtil = choreoUtil;
  }

  canExecute(context) {
    return this._choreoUtil.choreographies().length > 1;
  }

  preExecute(context) {
    context.removedChoreo = this._choreoUtil.currentChoreography();
    context.removedDiagram = this._choreoUtil.currentDiagram();

    // switch to the first choreography in the list that is not to be deleted
    this._commandStack.execute('choreography.switch', {
      id: this._choreoUtil.choreographies().find(choreo => choreo != context.removedChoreo).id
    });
  }

  execute(context) {
    context.indices = this._choreoUtil.removeChoreographyById(context.removedChoreo.id);
  }

  revert(context) {
    // reinsert the choreography and diagram at the right position
    this._choreoUtil.definitions().rootElements.splice(
      context.indices.choreoIndex,
      0,
      context.removedChoreo
    );
    this._choreoUtil.diagrams().splice(
      context.diagramIndex,
      0,
      context.removedDiagram
    );
  }
}
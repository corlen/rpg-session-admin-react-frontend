import React from "react";
import PropTypes from "prop-types";
import TextInput from "../common/TextInput";
import SelectInputMultiple from "../common/SelectInputMultiple";

const SessionForm = ({
  onSave,
  players,
  onChange,
  saving = false,
  errors = {}
}) => {
  return (
    <form onSubmit={onSave}>
      <h2>Add Session</h2>
      {errors.onSave && (
        <div className="alert alert-danger" role="alert">
          {errors.onSave}
        </div>
      )}
      <TextInput
        name="description"
        label="Description"
        onChange={onChange}
        error={errors.description}
      />
      <SelectInputMultiple
        name="players"
        label="Players"
        options={players.map(player => ({
          value: player.id,
          text: player.name
        }))}
        onChange={onChange}
        error={errors.players}
        multiple
      />

      <button type="submit" disabled={saving} className="btn btn-primary">
        {saving ? "Saving..." : "Save"}
      </button>
    </form>
  );
};

SessionForm.propTypes = {
  players: PropTypes.array.isRequired,
  errors: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  saving: PropTypes.bool
};

export default SessionForm;

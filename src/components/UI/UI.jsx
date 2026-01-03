import './UI.css';

/* רכיב סרגל סינון */
export const FilterBar = ({ criteria = [], search, setSearch, sortBy, setSortBy, }) => {

    return (
        <div className="Filter-bar-container">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                {criteria.map((crit, index) => (
                    <option key={index} value={crit}>{crit}</option>
                ))}
            </select>

            <div className="search-input-wrapper">
                <input
                    type="text"
                    placeholder={`Search by ${search.field}...`}
                    value={search.query}
                    onChange={(e) => setSearch(prev => ({ ...prev, query: e.target.value }))}
                />
                {search.query && (
                    <button
                        className="clear-btn"
                        onClick={() => setSearch(prev => ({ ...prev, query: '' }))}
                    >X</button>
                )}
            </div>

            <button
                className="switch-btn"
                onClick={() => search.changeFiled()}
            >🔄</button>
        </div>
    );
};


/* כפתור הוספה */
export const AddButton = ({ type, onClick }) => {
    return (
        <button className="add-btn" onClick={onClick}>Add New {type}</button>
    )
};


/* רכיב שמירה / ביטול */
export const SaveCancelButtons = ({ onSave, onCancel, width }) => {
    return (
        <div className="save-cancel-buttons">
            <button className="save-btn" onClick={onSave} style={{width: width}}>Save</button>
            <button className="cancel-btn" onClick={onCancel} style={{width: width}}>Cancel</button>
        </div>
    )
}
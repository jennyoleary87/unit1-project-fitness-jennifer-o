import Item from "./item";

const List = ({ items, renderItem }) => {

    try {
        if (!Array.isArray(items)) {
            console.error('items prop in List must be an array');
            return <p>Error: Invalid data provided to list</p>;
        }

        // handle empty message
        if (items.length === 0 && emptyMessage) {
            return <div className="empty-message">{emptyMessage}</div>;
        }

        return (
            <div>
                {items.map((item, index) => (
                    <Item key={item.id || index}>
                        {renderItem ? renderItem(item, index) : item}
                    </Item>
                ))}

            </div>
        );
    } catch (error) {
        console.error('List component error', error);
        return <p>Error displaying list</p>;
    }
};

export default List;
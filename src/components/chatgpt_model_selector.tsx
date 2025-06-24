import { chatgptModelOptions } from '@/constants';
import { ModelDropdownProps } from '@/types';
import {
    SelectContent,
    SelectItem,
    SelectRoot,
    SelectTrigger,
    SelectValueText
} from '@/components/ui/select';

const ChatGPTModelSelector: React.FC<ModelDropdownProps> = ({
    defaultValue = ['gpt-4o'], // set a fallback value
    size = 'md',
    width = '200px'
}) => {
    return (
        <SelectRoot
            collection={chatgptModelOptions}
            defaultValue={defaultValue}
            size={size}
            width={width}
        >
            <SelectTrigger className="border">
                <SelectValueText placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
                {chatgptModelOptions.items.map(model => (
                    <SelectItem
                        className="cursor"
                        item={model}
                        key={model.value}
                        _hover={{ backgroundColor: 'gray.100' }}
                    >
                        {model.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </SelectRoot>
    );
};
export default ChatGPTModelSelector;

import { chatgptModelOptions } from '@/constants';
import { ModelDropdownProps } from '@/types';
import { Portal, Select } from '@chakra-ui/react';

const ChatGPTModelSelector: React.FC<ModelDropdownProps> = ({
    defaultValue = ['gpt-4o'], // set a fallback value
    size = 'md',
    width = '200px'
}) => {
    return (
        <Select.Root
            collection={chatgptModelOptions}
            defaultValue={defaultValue}
            size={size}
            width={width}
        >
            <Select.HiddenSelect />
            <Select.Control>
                <Select.Trigger className="border">
                    <Select.ValueText placeholder="Select model" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                    <Select.Content className="selector-content-background">
                        {chatgptModelOptions.items.map(model => (
                            <Select.Item
                                className="cursor"
                                item={model}
                                key={model.value}
                            >
                                {model.label}
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>
    );
};
export default ChatGPTModelSelector;

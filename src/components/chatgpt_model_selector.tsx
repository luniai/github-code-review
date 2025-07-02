import { chatgptModelOptions, defaultGenerativeAiSettings } from "../constants";
import { Portal, Select } from "@chakra-ui/react";

const ChatGPTModelSelector = ({ value, onChange }) => {
	return (
		<Select.Root
			collection={chatgptModelOptions}
			value={[value || defaultGenerativeAiSettings.defaultOpenAiModel]}
			onValueChange={({ value }) => onChange(value[0])}
		>
			<Select.HiddenSelect />
			<Select.Control className="selector-control">
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
						{chatgptModelOptions.items.map((model) => (
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
